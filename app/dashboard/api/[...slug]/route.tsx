import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  if (params.slug[0] === "kelompok") {
    const result = await Kelompok(params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "status") {
    const result = await Status();
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

async function Kelompok(kelompok: String) {
  if (kelompok == "Perbidang") {
    const x = await prisma.bidang.findMany({
      include: {
        user: {
          include: {
            usulan: true,
          },
        },
      },
      orderBy: {
        nama: "asc",
      },
    });

    let usulanAll = [];
    let usulanTerima = [];
    let usulanTolak = [];
    let usulanProses = [];
    let grup = [];

    for (let i = 0; i < x.length; i++) {
      const all = await prisma.usulan.aggregate({
        where: {
          user: {
            bidangId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const terima = await prisma.usulan.aggregate({
        where: {
          status: 1,
          user: {
            bidangId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const tolak = await prisma.usulan.aggregate({
        where: {
          status: 2,
          user: {
            bidangId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const proses = await prisma.usulan.aggregate({
        where: {
          status: 0,
          user: {
            bidangId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });
      if (all._count.id > 0) {
        grup.push(x[i].nama);
        usulanAll.push(all._count.id);
        usulanTerima.push(terima._count.id);
        usulanTolak.push(tolak._count.id);
        usulanProses.push(proses._count.id);
      }
    }

    return {
      kelompok: grup,
      usulan: usulanAll,
      terima: usulanTerima,
      tolak: usulanTolak,
      proses: usulanProses,
    };
  }

  if (kelompok == "Instalasi") {
    const x = await prisma.instalasi.findMany({
      include: {
        user: {
          include: {
            usulan: true,
          },
        },
      },
      orderBy: {
        nama: "asc",
      },
    });

    let usulanAll = [];
    let usulanTerima = [];
    let usulanTolak = [];
    let usulanProses = [];
    let grup = [];

    for (let i = 0; i < x.length; i++) {
      const all = await prisma.usulan.aggregate({
        where: {
          user: {
            instalasiId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const terima = await prisma.usulan.aggregate({
        where: {
          status: 1,
          user: {
            instalasiId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const tolak = await prisma.usulan.aggregate({
        where: {
          status: 2,
          user: {
            instalasiId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const proses = await prisma.usulan.aggregate({
        where: {
          status: 0,
          user: {
            instalasiId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      if (all._count.id > 0) {
        grup.push(x[i].nama);
        usulanAll.push(all._count.id);
        usulanTerima.push(terima._count.id);
        usulanTolak.push(tolak._count.id);
        usulanProses.push(proses._count.id);
      }
    }

    return {
      kelompok: grup,
      usulan: usulanAll,
      terima: usulanTerima,
      tolak: usulanTolak,
      proses: usulanProses,
    };
  }

  if (kelompok == "Ruangan") {
    const x = await prisma.ruangan.findMany({
      include: {
        user: {
          include: {
            usulan: true,
          },
        },
      },
      orderBy: {
        nama: "asc",
      },
    });

    let usulanAll = [];
    let usulanTerima = [];
    let usulanTolak = [];
    let usulanProses = [];
    let grup = [];

    for (let i = 0; i < x.length; i++) {
      const all = await prisma.usulan.aggregate({
        where: {
          user: {
            ruanganId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const terima = await prisma.usulan.aggregate({
        where: {
          status: 1,
          user: {
            ruanganId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const tolak = await prisma.usulan.aggregate({
        where: {
          status: 2,
          user: {
            ruanganId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      const proses = await prisma.usulan.aggregate({
        where: {
          status: 0,
          user: {
            ruanganId: x[i].id,
          },
        },
        _count: {
          id: true,
        },
      });

      if (all._count.id > 0) {
        grup.push(x[i].nama);
        usulanAll.push(all._count.id);
        usulanTerima.push(terima._count.id);
        usulanTolak.push(tolak._count.id);
        usulanProses.push(proses._count.id);
      }
    }

    return {
      kelompok: grup,
      usulan: usulanAll,
      terima: usulanTerima,
      tolak: usulanTolak,
      proses: usulanProses,
    };
  }

  if (kelompok == "Komponen Belanja") {
    const x = await prisma.komponen.findMany({
      orderBy: {
        nama: "asc",
      },
    });

    let usulanAll = [];
    let usulanTerima = [];
    let usulanTolak = [];
    let usulanProses = [];
    let grup = [];

    for (let i = 0; i < x.length; i++) {
      const all = await prisma.usulan.aggregate({
        where: {
          komponenId: x[i].id,
        },
        _count: {
          id: true,
        },
      });

      const terima = await prisma.usulan.aggregate({
        where: {
          status: 1,
          komponenId: x[i].id,
        },
        _count: {
          id: true,
        },
      });

      const tolak = await prisma.usulan.aggregate({
        where: {
          status: 2,
          komponenId: x[i].id,
        },
        _count: {
          id: true,
        },
      });

      const proses = await prisma.usulan.aggregate({
        where: {
          status: 0,
          komponenId: x[i].id,
        },
        _count: {
          id: true,
        },
      });

      if (all._count.id > 0) {
        grup.push(x[i].nama);
        usulanAll.push(all._count.id);
        usulanTerima.push(terima._count.id);
        usulanTolak.push(tolak._count.id);
        usulanProses.push(proses._count.id);
      }
    }

    return {
      kelompok: grup,
      usulan: usulanAll,
      terima: usulanTerima,
      tolak: usulanTolak,
      proses: usulanProses,
    };
  }

  return {};
}

async function Status() {
  const proses = await prisma.usulan.aggregate({
    where: {
      status: 0,
    },
    _count: {
      id: true,
    },
  });

  const terima = await prisma.usulan.aggregate({
    where: {
      status: 1,
    },
    _count: {
      id: true,
    },
  });

  const ditolak = await prisma.usulan.aggregate({
    where: {
      status: 2,
    },
    _count: {
      id: true,
    },
  });

  const komponen = await prisma.komponen.findMany({
    orderBy: {
      nama: "asc",
    },
  });

  let kom = [];
  for (let i = 0; i < komponen.length; i++) {
    const j = await prisma.usulan.aggregate({
      where: {
        komponenId: komponen[i].id,
      },
      _count: {
        id: true,
      },
    });

    if (j._count.id > 0) {
      kom.push({
        name: komponen[i].nama,
        value: j._count.id,
      });
    }
  }

  return {
    status: [
      { name: "On Proses", value: proses._count.id },
      { name: "Diterima", value: terima._count.id },
      { name: "Ditolak", value: ditolak._count.id },
    ],
    komponen: kom,
  };
}
