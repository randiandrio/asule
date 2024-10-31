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
  const paslon = await prisma.instalasi.findMany({
    orderBy: { nama: "asc" },
  });
  return paslon;
}

async function Post(data: any) {
  if (String(data.get("mode")) == "add") {
    await prisma.instalasi.create({
      data: {
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data instalasi berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.instalasi.update({
      where: { id: Number(data.get("id")) },
      data: {
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data instalasi berhasil diperbarui" };
  } else {
    await prisma.instalasi.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data instalasi berhasil dihapus" };
  }
}
