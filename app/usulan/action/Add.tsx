"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Komponen } from "@prisma/client";
import React from "react";
import { uploadMultiFile } from "@/app/helper";

function Add({
  reload,
  komponens,
}: {
  reload: Function;
  komponens: Komponen[];
}) {
  const [komponenId, setkomponenId] = useState("");
  const [judul, setjudul] = useState("");
  const [uraian, seturaian] = useState("");
  const [volume, setvolume] = useState("");
  const [satuan, setsatuan] = useState("");
  const [spesifikasi, setspesifikasi] = useState("");
  const [merk, setmerk] = useState("");
  const [keterangan, setketerangan] = useState("");
  const [landasan, setlandasan] = useState("");
  const [lampirans, setLampirans] = useState<File[]>([]);

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

    let namaFiles = [];

    if (lampirans.length > 0) {
      const responseUpload = await uploadMultiFile(lampirans as File[]);
      if (responseUpload.status && responseUpload.files.length > 0) {
        namaFiles = responseUpload.files;
      }
    }

    const formData = new FormData();
    formData.append("mode", "add");
    formData.append("komponenId", String(komponenId));
    formData.append("judul", String(judul));
    formData.append("uraian", String(uraian));
    formData.append("volume", String(volume));
    formData.append("satuan", String(satuan));
    formData.append("spesifikasi", String(spesifikasi));
    formData.append("merk", String(merk));
    formData.append("keterangan", String(keterangan));
    formData.append("landasan", String(landasan));
    if (namaFiles.length > 0) {
      formData.append("namaFiles", String(namaFiles));
    }

    const x = await axios.patch("/usulan/api/post", formData);
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
    setkomponenId("");

    setjudul("");
    seturaian("");
    setvolume("");
    setsatuan("");
    setspesifikasi("");
    setmerk("");
    setketerangan("");
    setlandasan("");
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLampirans(Array.from(event.target.files));
    }
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah Usulan
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
            <Modal.Title>Tambah Usulan</Modal.Title>
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
              <label className="col-sm-4 col-form-label">
                Uraian Komponen Belanja
              </label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  value={uraian}
                  onChange={(e) => seturaian(e.target.value)}
                />
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

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Lampiran</label>
              <div className="col-sm-8">
                <input
                  multiple
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
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
              Simpan
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Add;
function useDropzone(): {
  acceptedFiles: any;
  getRootProps: any;
  getInputProps: any;
} {
  throw new Error("Function not implemented.");
}
