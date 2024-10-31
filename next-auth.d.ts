import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: Number;
    jabatanId: Number;
    jabatan: String;
    nama: String;
    role: String;
  }

  interface Session {
    user: {
      id: Number;
      jabatanId: Number;
      jabatan: String;
      nama: String;
      role: String;
    };
  }

  interface JWT {
    id: Number;
    jabatanId: Number;
    jabatan: String;
    nama: String;
    role: String;
  }

  interface resData {
    error: boolean;
    message: String;
  }
}
