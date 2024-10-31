import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const PATCH = async (request: NextRequest) => {
  const data = await request.formData();
  const result = await Post(data);
  return NextResponse.json(result, { status: 200 });
};

async function Post(data: any) {
  const admin = await prisma.user.findUnique({
    where: {
      id: Number(data.get("id")),
    },
  });

  const isValid = await bcrypt.compare(
    String(data.get("passLama")),
    String(admin!.password)
  );

  if (!isValid) {
    return { error: true, msg: "Password lama salah, silahkan coba lagi" };
  }

  const hashPassword = await bcrypt.hash(String(data.get("passBaru")), 10);

  await prisma.user.update({
    where: {
      id: Number(data.get("id")),
    },
    data: {
      password: hashPassword,
    },
  });

  return { err: false, msg: "Ganti password sukses" };
}
