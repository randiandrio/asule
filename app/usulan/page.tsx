"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "./action/Add";
import Update from "./action/update";
import Delete from "./action/Delete";
import { Komponen, User } from "@prisma/client";
import Link from "next/link";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const UsulanPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState<any[]>([]);
  const [userId, setUserId] = useState(0);
  const [komponens, setKomponens] = useState<Komponen[]>([]);

  useEffect(() => {
    loadKomponen();
    reload();
  }, []);

  const loadKomponen = async () => {
    fetch(`/master/komponen/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setKomponens(x);
      });
  };

  const reload = async () => {
    fetch(`/usulan/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x.data);
        setUserId(x.userId);
        setLoading(false);
      });
  };

  const columns: TableColumn<any>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Judul Usulan",
      selector: (row) => String(row.judul),
      sortable: true,
    },
    {
      name: "Di Input Oleh",
      selector: (row) => String(row.user.nama),
      sortable: true,
    },
    {
      name: "Komponen Belanja",
      selector: (row) => String(row.komponen.nama),
      sortable: true,
    },
    {
      name: "Bidang",
      selector: (row) => String(row.user.bidang ? row.user.bidang.nama : "-"),
      sortable: true,
    },
    {
      name: "Instalasi",
      selector: (row) =>
        String(row.user.instalasi ? row.user.instalasi.nama : "-"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => String(row.user.ruangan ? row.user.ruangan.nama : "-"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.isFinish > 0 ? "Selesai" : "Onprogress"),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "260px",
      cell: (row) => (
        <div className="d-flex">
          {row.userId == userId && row.accPimpinan == 0 && (
            <>
              <Update reload={reload} usulan={row} komponens={komponens} />
              <Delete reload={reload} usulan={row} />
            </>
          )}

          <Link href={`/usulan/detail/${row.id}`}>
            <button
              type="button"
              className="btn btn-success shadow btn-xs mx-1"
            >
              Lihat Usulan
            </button>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Data Usulan</h4>
              </div>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={datas}
                customStyles={customStyles}
                onChangePage={(page) => {
                  setPage(page);
                }}
                onChangeRowsPerPage={(page) => {
                  setPage(1);
                  setPerpage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Add reload={reload} komponens={komponens} />
      </div>
    </div>
  );
};

export default UsulanPage;
