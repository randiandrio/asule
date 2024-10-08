"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Komponen, Usulan } from "@prisma/client";

function Update({
  reload,
  komponens,
  usulan,
}: {
  reload: Function;
  komponens: Komponen[];
  usulan: Usulan;
}) {
  const [komponenId, setkomponenId] = useState(String(usulan.komponenId));
  const [judul, setjudul] = useState(String(usulan.judul));
  const [uraian, seturaian] = useState(String(usulan.uraian));
  const [volume, setvolume] = useState(String(usulan.volume));
  const [satuan, setsatuan] = useState(String(usulan.satuan));
  const [spesifikasi, setspesifikasi] = useState(String(usulan.spesifikasi));
  const [merk, setmerk] = useState(String(usulan.merk));
  const [keterangan, setketerangan] = useState(String(usulan.keterangan));
  const [landasan, setlandasan] = useState(String(usulan.landasan));

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
    formData.append("id", String(usulan.id));
    formData.append("komponenId", String(komponenId));
    formData.append("judul", String(judul));
    formData.append("uraian", String(uraian));
    formData.append("volume", String(volume));
    formData.append("satuan", String(satuan));
    formData.append("spesifikasi", String(spesifikasi));
    formData.append("merk", String(merk));
    formData.append("keterangan", String(keterangan));
    formData.append("landasan", String(landasan));
    const x = await axios.patch("/usulan/api/post", formData);
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
            <Modal.Title>Edit Usulan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Judul Usulan</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={judul}
                  onChange={(e) => setjudul(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Komponen Usulan</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={komponenId}
                  onChange={(e) => setkomponenId(e.target.value)}
                >
                  <option value="">Pilih Komponen</option>

                  {komponens.map((x: Komponen) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Volume</label>
              <div className="col-sm-4">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={volume}
                  placeholder="Volume"
                  onChange={(e) => setvolume(e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={satuan}
                  placeholder="Satuan"
                  onChange={(e) => setsatuan(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Spesifikasi</label>
              <div className="col-sm-8">
                <textarea
                  required
                  className="form-control"
                  value={spesifikasi}
                  onChange={(e) => setspesifikasi(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Merk</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={merk}
                  onChange={(e) => setmerk(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Landasan Usulan</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  value={landasan}
                  onChange={(e) => setlandasan(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Ketarangan</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  value={keterangan}
                  onChange={(e) => setketerangan(e.target.value)}
                />
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
