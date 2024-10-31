import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { User } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as User;

  if (params.slug[0] === "data") {
    const result = await Data(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "detail") {
    const result = await Detail(params.slug[1], adminLogin);
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

  const adminLogin = token as unknown as User;

  const data = await request.formData();

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Data(admin: User) {
  let data;
  if (admin.role == "admin") {
    data = await prisma.usulan.findMany({
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
      orderBy: {
        id: "desc",
      },
    });
  } else {
    const users = await prisma.disposisi.findMany({
      where: { userId: Number(admin.id) },
    });

    var usulanIds = users.map(function (item) {
      return item.usulanId;
    });
    data = await prisma.usulan.findMany({
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
      orderBy: {
        id: "desc",
      },
    });
  }

  return { data: data, userId: admin.id };
}

async function Detail(id: String, admin: User) {
  const usulan = await prisma.usulan.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      komponen: true,
      lampiran: true,
      disposisi: {
        include: {
          user: {
            include: {
              jabatan: true,
              bidang: true,
            },
          },
        },
      },
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: Number(admin.id),
    },
  });

  const disposisi = await prisma.disposisi.findMany({
    where: {
      userId: Number(admin.id),
      status: 0,
      usulanId: Number(id),
    },
  });

  return { data: usulan, user: user, disposisi: disposisi.length > 0 };
}

async function Post(data: any, admin: User) {
  const user = await prisma.user.findUnique({
    where: { id: Number(admin.id) },
    include: {
      jabatan: {
        include: {
          atasan: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

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

    if (data.get("namaFiles")) {
      const x = data.get("namaFiles");
      const nfs = x.split(",");

      for (let i = 0; i < nfs.length; i++) {
        await prisma.lampiran.create({
          data: {
            usulanId: usulan.id,
            nama: String(nfs[i]),
          },
        });
      }
    }

    const jabatan = await prisma.jabatan.findUnique({
      where: { id: 5 },
      include: {
        user: true,
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
          userId: Number(jabatan?.user[0].id),
          jabatanId: Number(jabatan?.user[0].jabatanId),
          usulanId: usulan.id,
          status: 0,
          catatan: "",
        },
      ],
    });

    return { error: false, message: "Data Usulan berhasil ditambahkan" };
  }

  if (String(data.get("mode")) == "update") {
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
  }

  if (String(data.get("mode")) == "tolak") {
    await prisma.disposisi.updateMany({
      where: {
        userId: Number(admin.id),
        usulanId: Number(data.get("id")),
      },
      data: {
        status: 1,
        ditolak: 1,
        catatan: String(data.get("catatan")),
      },
    });

    await prisma.usulan.update({
      where: {
        id: Number(data.get("id")),
      },
      data: {
        isFinish: 1,
        status: 2,
      },
    });

    return { error: false, message: "Data usulan telah di tolak" };
  }

  if (String(data.get("mode")) == "Teruskan") {
    await prisma.disposisi.updateMany({
      where: {
        userId: Number(admin.id),
        usulanId: Number(data.get("id")),
      },
      data: {
        status: 1,
        ditolak: 0,
        catatan: String(data.get("catatan")),
      },
    });

    if (user?.jabatanId == 5) {
      const oleh = await prisma.usulan.findUnique({
        where: { id: Number(data.get("id")) },
        include: {
          user: {
            include: {
              jabatan: {
                include: {
                  atasan: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await prisma.disposisi.create({
        data: {
          userId: Number(oleh?.user.jabatan?.atasan?.user[0].id),
          jabatanId: Number(oleh?.user.jabatan?.atasanId),
          usulanId: Number(data.get("id")),
          status: 0,
          catatan: "",
        },
      });
    } else {
      await prisma.disposisi.create({
        data: {
          userId: Number(user?.jabatan?.atasan?.user[0].id),
          jabatanId: Number(user?.jabatan?.atasan?.user[0].jabatanId),
          usulanId: Number(data.get("id")),
          status: 0,
          catatan: "",
        },
      });
    }

    return { error: false, message: "Data Usulan berhasil diteruskan" };
  }

  if (String(data.get("mode")) == "Disposisi") {
    if (admin.jabatanId == 1) {
      const usrs = await prisma.user.findMany({
        where: {
          jabatanId: 6,
        },
      });

      if (usrs.length == 0)
        return { error: true, message: "Belum ada Kabid Perencanaan" };

      await prisma.usulan.update({
        where: { id: Number(data.get("id")) },
        data: {
          accPimpinan: 1,
        },
      });

      await prisma.disposisi.updateMany({
        where: {
          userId: Number(admin.id),
          usulanId: Number(data.get("id")),
        },
        data: {
          status: 1,
          ditolak: 0,
          catatan: String(data.get("catatan")),
        },
      });

      await prisma.disposisi.create({
        data: {
          userId: Number(usrs[0].id),
          jabatanId: Number(usrs[0].jabatanId),
          usulanId: Number(data.get("id")),
          status: 0,
          catatan: "",
        },
      });
    }

    if (admin.jabatanId == 6) {
      await prisma.disposisi.updateMany({
        where: {
          userId: Number(admin.id),
          usulanId: Number(data.get("id")),
        },
        data: {
          status: 1,
          ditolak: 0,
          catatan: String(data.get("catatan")),
        },
      });

      await prisma.usulan.update({
        where: {
          id: Number(data.get("id")),
        },
        data: {
          isFinish: 1,
          status: 1,
        },
      });
    }

    return { error: false, message: "Data Usulan berhasil didisposisi" };
  }

  await prisma.usulan.delete({
    where: { id: Number(data.get("id")) },
  });

  return { error: false, message: "Data usulan berhasil dihapus" };
}
