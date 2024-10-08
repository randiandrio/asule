"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "./action/Add";
import Update from "./action/update";
import Delete from "./action/Delete";
import {
  Bidang,
  Instalasi,
  Jabatan,
  Output,
  Ruangan,
  User,
} from "@prisma/client";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const KaryawanPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState<any[]>([]);
  const [jabatans, setJabatans] = useState<Jabatan[]>([]);
  const [bidangs, setBidangs] = useState<Bidang[]>([]);
  const [instalasis, setInstalasis] = useState<Instalasi[]>([]);
  const [ruangans, setRuangans] = useState<Ruangan[]>([]);
  const [outputs, setOutputs] = useState<Output[]>([]);

  useEffect(() => {
    listJabatan();
    listBidang();
    listInstalasi();
    listRuangan();
    listOutput();
    reload();
  }, []);

  const listJabatan = async () => {
    fetch(`/master/jabatan/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setJabatans(x);
      });
  };

  const listBidang = async () => {
    fetch(`/master/bidang/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setBidangs(x);
      });
  };

  const listInstalasi = async () => {
    fetch(`/master/instalasi/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setInstalasis(x);
      });
  };

  const listRuangan = async () => {
    fetch(`/master/ruangan/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setRuangans(x);
      });
  };

  const listOutput = async () => {
    fetch(`/master/output/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setOutputs(x);
      });
  };

  const reload = async () => {
    fetch(`/karyawan/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
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
      name: "Nama",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => String(row.username),
      sortable: true,
    },
    {
      name: "Jabatan",
      selector: (row) => String(row.jabatan ? row.jabatan.nama : "-"),
      sortable: true,
    },
    {
      name: "Bidang",
      selector: (row) => String(row.bidang ? row.bidang.nama : "-"),
      sortable: true,
    },
    {
      name: "Instalasi",
      selector: (row) => String(row.instalasi ? row.instalasi.nama : "-"),
      sortable: true,
    },
    {
      name: "Ruangan",
      selector: (row) => String(row.ruangan ? row.ruangan.nama : "-"),
      sortable: true,
    },
    {
      name: "Menangani Output",
      selector: (row) => String(row.output ? row.output.nama : "-"),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "120px",
      cell: (row) => (
        <div className="d-flex">
          <Update
            reload={reload}
            user={row}
            jabatans={jabatans}
            bidangs={bidangs}
            instalasis={instalasis}
            ruangans={ruangans}
            outputs={outputs}
          />
          <Delete reload={reload} user={row} />
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
                <h4 className="card-title">Data Karyawan</h4>
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
        <Add
          reload={reload}
          jabatans={jabatans}
          bidangs={bidangs}
          instalasis={instalasis}
          ruangans={ruangans}
          outputs={outputs}
        />
      </div>
    </div>
  );
};

export default KaryawanPage;
