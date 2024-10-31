import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

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
  const paslon = await prisma.output.findMany({
    orderBy: { nama: "asc" },
  });
  return paslon;
}

async function Post(data: any) {
  if (String(data.get("mode")) == "add") {
    await prisma.output.create({
      data: {
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data output berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.output.update({
      where: { id: Number(data.get("id")) },
      data: {
        nama: String(data.get("nama")),
      },
    });
    return { error: false, message: "Data output berhasil diperbarui" };
  } else {
    await prisma.output.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data output berhasil dihapus" };
  }
}
