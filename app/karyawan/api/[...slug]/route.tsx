import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cekUsername } from "@/app/helper";

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
  const users = await prisma.user.findMany({
    orderBy: { nama: "asc" },
    where: { id: { not: 1 } },
    include: {
      jabatan: true,
      bidang: true,
      ruangan: true,
      output: true,
      instalasi: true,
    },
  });
  return users;
}

async function Post(data: any) {
  if (String(data.get("mode")) == "add") {
    const cek = await cekUsername(String(data.get("username")), 0);

    if (cek) {
      return { error: true, message: "Username telah digunakan" };
    }

    const hashPassword = await bcrypt.hash(data.get("password"), 10);
    await prisma.user.create({
      data: {
        nama: String(data.get("nama")),
        bidangId:
          Number(data.get("bidangId")) > 0
            ? Number(data.get("bidangId"))
            : null,
        instalasiId:
          Number(data.get("instalasiId")) > 0
            ? Number(data.get("instalasiId"))
            : null,
        ruanganId:
          Number(data.get("ruanganId")) > 0
            ? Number(data.get("ruanganId"))
            : null,
        outputId:
          Number(data.get("outputId")) > 0
            ? Number(data.get("outputId"))
            : null,
        jabatanId:
          Number(data.get("jabatanId")) > 0
            ? Number(data.get("jabatanId"))
            : null,
        username: String(data.get("username")),
        password: hashPassword,
      },
    });
    return { error: false, message: "Data karyawan berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    const cek = await cekUsername(
      String(data.get("username")),
      Number(data.get("id"))
    );

    if (cek) {
      return { error: true, message: "Username telah digunakan" };
    }

    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        nama: String(data.get("nama")),
        bidangId:
          Number(data.get("bidangId")) > 0
            ? Number(data.get("bidangId"))
            : null,
        instalasiId:
          Number(data.get("instalasiId")) > 0
            ? Number(data.get("instalasiId"))
            : null,
        ruanganId:
          Number(data.get("ruanganId")) > 0
            ? Number(data.get("ruanganId"))
            : null,
        outputId:
          Number(data.get("outputId")) > 0
            ? Number(data.get("outputId"))
            : null,
        jabatanId:
          Number(data.get("jabatanId")) > 0
            ? Number(data.get("jabatanId"))
            : null,
        username: String(data.get("username")),
      },
    });

    if (String(data.get("password") != "")) {
      const hashPassword = await bcrypt.hash(data.get("password"), 10);
      await prisma.user.update({
        where: { id: Number(data.get("id")) },
        data: {
          password: hashPassword,
        },
      });
    }

    return { error: false, message: "Data karyawan berhasil diperbarui" };
  } else {
    await prisma.user.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data karyawan berhasil dihapus" };
  }
}
