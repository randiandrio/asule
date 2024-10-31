import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <div>
      <div className="nav-header">
        <a href="#" className="brand-logo">
          <Image
            className="logo-abbr"
            src={`/template/logo.png`}
            width={55}
            height={70}
            alt="xxx"
          />
          <Image
            className="brand-title"
            src={`/template/logo_text.png`}
            width={150}
            height={45}
            alt="xxx"
          />
        </a>
        <div className="nav-control">
          <div className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="px-3 pt-1">
                  <h4 style={{ lineHeight: "0px" }}>{session?.user.nama}</h4>
                  <small style={{ lineHeight: "15px" }}>
                    {session?.user.jabatan}
                  </small>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
