"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "./action/Add";
import Update from "./action/update";
import Delete from "./action/Delete";
import { Bidang } from "@prisma/client";
import React from "react";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const BidangPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState<Bidang[]>([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/bidang/api/data`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        setLoading(false);
      });
  };

  const columns: TableColumn<Bidang>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Nama Bidang",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "120px",
      cell: (row) => (
        <div className="d-flex">
          {row.id > 2 && (
            <>
              <Update reload={reload} bidang={row} />
              <Delete reload={reload} bidang={row} />
            </>
          )}
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
                <h4 className="card-title">Data Bidang</h4>
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
        <Add reload={reload} />
      </div>
    </div>
  );
};

export default BidangPage;
