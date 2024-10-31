import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  if (params.slug[0] === "data") {
    const result = await Data();
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const data = await request.formData();

  if (params.slug[0] == "post") {
    const result = await Post(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Data() {
  const paslon = await prisma.jabatan.findMany({
    orderBy: { nama: "asc" },
    include: {
      atasan: true,
    },
  });
  return paslon;
}

async function Post(data: any) {
  if (String(data.get("mode")) == "add") {
    await prisma.jabatan.create({
      data: {
        atasanId:
          Number(data.get("atasanId")) > 0
            ? Number(data.get("atasanId"))
            : null,
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data jabatan berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.jabatan.update({
      where: { id: Number(data.get("id")) },
      data: {
        atasanId:
          Number(data.get("atasanId")) > 0
            ? Number(data.get("atasanId"))
            : null,
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data jabatan berhasil diperbarui" };
  } else {
    await prisma.jabatan.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data jabatan berhasil dihapus" };
  }
}
