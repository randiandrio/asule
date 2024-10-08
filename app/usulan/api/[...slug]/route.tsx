import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { AdminLogin } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  if (params.slug[0] === "data") {
    const result = await Data(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  const data = await request.formData();

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Data(admin: AdminLogin) {
  const users = await prisma.disposisi.findMany({
    where: { userId: Number(admin.id) },
  });

  var usulanIds = users.map(function (item) {
    return item.usulanId;
  });

  const data = await prisma.usulan.findMany({
    where: {
      id: {
        in: usulanIds,
      },
    },
    include: {
      user: {
        include: {
          bidang: true,
          instalasi: true,
          ruangan: true,
        },
      },
      komponen: true,
    },
  });

  return data;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("mode")) == "add") {
    const usulan = await prisma.usulan.create({
      data: {
        userId: Number(admin.id),
        komponenId: Number(data.get("komponenId")),
        judul: String(data.get("judul")),
        uraian: String(data.get("uraian")),
        volume: Number(data.get("volume")),
        satuan: String(data.get("satuan")),
        spesifikasi: String(data.get("spesifikasi")),
        merk: String(data.get("merk")),
        keterangan: String(data.get("keterangan")),
        landasan: String(data.get("landasan")),
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: Number(admin.id) },
    });

    const jabatan = await prisma.jabatan.findUnique({
      where: { id: Number(user?.jabatanId) },
      include: {
        atasan: {
          include: {
            user: true,
          },
        },
      },
    });

    await prisma.disposisi.createMany({
      data: [
        {
          userId: Number(admin.id),
          jabatanId: user?.jabatanId,
          usulanId: usulan.id,
          status: 1,
          catatan: "Usulan diajukan",
        },
        {
          userId: Number(jabatan?.atasan?.user[0].id),
          jabatanId: Number(jabatan?.atasanId),
          usulanId: usulan.id,
          status: 0,
          catatan: "",
        },
      ],
    });

    return { error: false, message: "Data Usulan berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.usulan.update({
      where: { id: Number(data.get("id")) },
      data: {
        komponenId: Number(data.get("komponenId")),
        judul: String(data.get("judul")),
        uraian: String(data.get("uraian")),
        volume: Number(data.get("volume")),
        satuan: String(data.get("satuan")),
        spesifikasi: String(data.get("spesifikasi")),
        merk: String(data.get("merk")),
        keterangan: String(data.get("keterangan")),
        landasan: String(data.get("landasan")),
      },
    });
    return { error: false, message: "Data usulan berhasil diperbarui" };
  } else {
    await prisma.usulan.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data usulan berhasil dihapus" };
  }
}
