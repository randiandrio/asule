import { PrismaClient, User } from "@prisma/client";
import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import Swal from "sweetalert2";

const prisma = new PrismaClient();

export const apiFile = "https://file.sispol.id/storage/asule";
export const urlUploadFiles = "https://file.sispol.id/api/uploadFiles";

export const firebaseProject = "pilkada";
export const tinymceKey = "88q5wvly8zzdap7pwq23poqjt3amwdk1v5iwdg9hr0xnqiq3";

export function tglIndo(tanggal: String) {
  const listBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const tahun = tanggal.slice(0, 4);
  const xbulan = tanggal.slice(5, 7);
  const tgl = tanggal.substring(8, 10);
  const bulan = listBulan[Number(xbulan) - 1];

  return `${tgl} ${bulan} ${tahun}`;
}

export function tglJamIndo(tanggal: String) {
  const x = moment(String(tanggal)).format("DD/MM/YYYY HH:mm:ss");
  return x;
}

export function tglJamIndoMap(tanggal: String) {
  const x = moment(String(tanggal)).format("DD/MM/YYYY HH:mm:ss");
  const z = x.split(" ");
  return {
    tanggal: z[0],
    jam: z[1],
  };
}

export function rupiah(amount: Number) {
  const x = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return `Rp. ${x}`;
}

export function noRupiah(amount: Number) {
  const x = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return x;
}

export function ucwords(str: String) {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}

export function randomString(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function tampilLoading() {
  return Swal.fire({
    title: "Mohon tunggu",
    html: "Sedang mengirim data",
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export async function uploadMultiFile(files: File[]) {
  const fileData = new FormData();
  files.forEach((file) => {
    fileData.append("files[]", file);
  });

  const up = await axios.post(urlUploadFiles, fileData);

  return up.data;
}

export async function cekUsername(username: String, id: number) {
  let users = [];
  if (id > 0) {
    users = await prisma.user.findMany({
      where: {
        username: String(username),
        id: {
          not: id,
        },
      },
    });
  } else {
    users = await prisma.user.findMany({
      where: {
        username: String(username),
      },
    });
  }

  return users.length > 0;
}
