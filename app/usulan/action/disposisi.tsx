"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";

function Disposisi({
  reload,
  id,
  jabatanId,
  accPimpinan,
}: {
  reload: Function;
  id: Number;
  jabatanId: Number;
  accPimpinan: Number;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [catatan, setCatatan] = useState("");
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
    formData.append(
      "mode",
      Number(jabatanId) > 1 || Number(accPimpinan) > 0
        ? "Teruskan"
        : "Disposisi"
    );
    formData.append("id", String(id));
    formData.append("catatan", String(catatan));
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
      <button
        onClick={handleShow}
        type="button"
        className="btn me-2 btn-primary light"
      >
        {Number(jabatanId) > 1 ? "Teruskan" : "Disposisi"}
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
            <Modal.Title>
              {Number(jabatanId) > 1 ? "Teruskan" : "Disposisi"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-12 col-form-label">
                Catatan Lanjutan
              </label>
              <div className="col-sm-12">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
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
              {Number(jabatanId) > 1 ? "Teruskan" : "Disposisi"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Disposisi;
