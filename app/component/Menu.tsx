"use client";

import Link from "next/link";
import Image from "next/image";
import { AdminLogin } from "next-auth";

const menuAdmin = (
  <>
    <li>
      <a
        className="has-arrow "
        href="javascript:void(0);"
        aria-expanded="false"
      >
        <div className="menu-icon">
          <Image
            src="/template/menu/database.png"
            width={25}
            height={25}
            alt="database"
          />
        </div>
        <span className="nav-text">Master Data</span>
      </a>

      <ul>
        <li className="mini-dashboard">Master Data</li>

        <li>
          <Link href="/master/bidang">Bidang</Link>
        </li>
        <li>
          <Link href="/master/instalasi">Instalasi</Link>
        </li>
        <li>
          <Link href="/master/ruangan">Ruangan</Link>
        </li>
        <li>
          <Link href="/master/jabatan">Jabatan</Link>
        </li>
        <li>
          <Link href="/master/output">Output</Link>
        </li>
        <li>
          <Link href="/master/komponen">Komponen</Link>
        </li>
      </ul>
    </li>

    <li>
      <Link href="/karyawan" className="" aria-expanded="false">
        <div className="menu-icon">
          <Image
            src="/template/menu/user.png"
            width={25}
            height={25}
            alt="xxx"
          />
        </div>
        <span className="nav-text">Data Karyawan </span>
      </Link>
    </li>
  </>
);

const menuUser = <></>;

export default function Menu({ akses }: { akses: String }) {
  if (akses == "admin") {
    return menuAdmin;
  } else {
    return menuUser;
  }
}
