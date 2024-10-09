import NextAuth from "next-auth";

declare module "next-auth" {
  interface AdminLogin {
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

  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}
