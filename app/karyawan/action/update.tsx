"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import {
  Bidang,
  Instalasi,
  Jabatan,
  Output,
  Ruangan,
  User,
} from "@prisma/client";

function Update({
  reload,
  user,
  jabatans,
  bidangs,
  instalasis,
  ruangans,
  outputs,
}: {
  reload: Function;
  user: User;
  jabatans: Jabatan[];
  bidangs: Bidang[];
  instalasis: Instalasi[];
  ruangans: Ruangan[];
  outputs: Output[];
}) {
  const [nama, setNama] = useState(user.nama);
  const [jabatanId, setJabatanId] = useState(String(user.jabatanId ?? "0"));
  const [bidangId, setBidangId] = useState(String(user.bidangId ?? "0"));
  const [instalasiId, setInstalasiId] = useState(
    String(user.instalasiId ?? "0")
  );
  const [ruanganId, setRuanganId] = useState(String(user.ruanganId ?? "0"));
  const [outputId, setOutputId] = useState(String(user.outputId ?? "0"));
  const [username, setUsername] = useState(String(user.username));
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang mengirim data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setPost(true);

    const formData = new FormData();
    formData.append("mode", "update");
    formData.append("id", String(user.id));
    formData.append("nama", String(nama));
    formData.append("jabatanId", String(jabatanId));
    formData.append("bidangId", String(bidangId));
    formData.append("instalasiId", String(instalasiId));
    formData.append("ruanganId", String(ruanganId));
    formData.append("outputId", String(outputId));
    formData.append("username", String(username));
    formData.append("password", String(password));
    const x = await axios.patch("/karyawan/api/post", formData);
    const pesan = (await x.data) as resData;
    if (!pesan.error) {
      handleClose();
      reload();
    }
    setPost(false);
    Swal.fire({
      title: pesan.error ? "Error" : "Success!",
      text: String(pesan.message),
      icon: pesan.error ? "error" : "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-info shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-edit"></i>
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Karyawan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Nama Karyawan</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Username</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Password</label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small>*kosongkan jika tidak diganti</small>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jabatan</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={jabatanId}
                  onChange={(e) => setJabatanId(e.target.value)}
                >
                  <option value="">Tidak ada jabatan</option>

                  {jabatans.map((jabatan: Jabatan) => (
                    <option key={jabatan.id} value={jabatan.id}>
                      {jabatan.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Bidang</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={bidangId}
                  onChange={(e) => setBidangId(e.target.value)}
                >
                  <option value="0">Tidak ada Bidang</option>

                  {bidangs.map((x: Bidang) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Instalasi</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={instalasiId}
                  onChange={(e) => setInstalasiId(e.target.value)}
                >
                  <option value="0">Tidak ada Instalasi</option>

                  {instalasis.map((x: Instalasi) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Ruangan</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={ruanganId}
                  onChange={(e) => setRuanganId(e.target.value)}
                >
                  <option value="0">Tidak ada Ruangan</option>

                  {ruangans.map((x: Ruangan) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Menangani Output
              </label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={outputId}
                  onChange={(e) => setOutputId(e.target.value)}
                >
                  <option value="0">Tidak ada</option>

                  {outputs.map((x: Output) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-danger light"
              onClick={handleClose}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary light">
              Update
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
