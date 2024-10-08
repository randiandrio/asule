"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Bidang, Instalasi, Jabatan, Output, Ruangan } from "@prisma/client";

function Add({
  reload,
  jabatans,
  bidangs,
  instalasis,
  ruangans,
  outputs,
}: {
  reload: Function;
  jabatans: Jabatan[];
  bidangs: Bidang[];
  instalasis: Instalasi[];
  ruangans: Ruangan[];
  outputs: Output[];
}) {
  const [nama, setNama] = useState("");
  const [jabatanId, setJabatanId] = useState("0");
  const [bidangId, setBidangId] = useState("0");
  const [instalasiId, setInstalasiId] = useState("0");
  const [ruanganId, setRuanganId] = useState("0");
  const [outputId, setOutputId] = useState("0");
  const [username, setUsername] = useState("");
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
    formData.append("mode", "add");
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
      clearForm();
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

  function clearForm() {
    setNama("");
    setJabatanId("0");
    setBidangId("0");
    setInstalasiId("0");
    setRuanganId("0");
    setOutputId("0");
    setUsername("");
    setPassword("");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah Karyawan
      </button>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Karyawan</Modal.Title>
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
                  required
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                  <option value="">Pilih Jabatan</option>

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
              Simpan
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Add;
