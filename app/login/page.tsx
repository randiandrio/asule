"use client";
import { signIn } from "next-auth/react";
import { SyntheticEvent, useRef, useState } from "react";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import React from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPost, setPost] = useState(false);
  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang validasi data login",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const result: any = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    setPost(false);

    if (result.error !== null) {
      Swal.fire({
        title: "Error !",
        text: "Kombinasi username dan password salah, silahkan coba lagi !",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="authincation h-100">
        <div className="container-fluid h-50">
          <div className="row h-100">
            <div
              style={{ marginTop: "50px" }}
              className="col-lg-12 col-md-12 col-sm-12 mx-auto align-self-center"
            >
              <div className="login-form">
                <div className="text-center">
                  <Image
                    src={`/template/logo_text.png`}
                    alt=""
                    width={300}
                    height={120}
                  />

                  <p className="mb-5" style={{ lineHeight: "5px" }}>
                    Aplikasi Usulan Elektronik RSUD Bangkinang
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-1 text-dark">Username</label>
                    <input
                      type="text"
                      className="form-control form-control"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 position-relative">
                    <label className="mb-1 text-dark">Password</label>
                    <input
                      type="password"
                      id="dz-password"
                      className="form-control form-control"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="text-center mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary light btn-block"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
