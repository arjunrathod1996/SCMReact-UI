import React, { useMemo, useState } from "react";
import MUIDataTable from "mui-datatables";

/* ================= TYPES ================= */

interface DataRow {
  policyId: string;
  domainRisk: string;
  documentName: string;
  sgCodeReference: string;
  policyPublicationDate: string;
  documentType: string;
  busu: string;
  implementationDeadlineDate: string;
  dispensationDeadlineDate: string;
  mypnpStatus: string;
}

/* ================= DATA ================= */

const hardCodedData: DataRow[] = Array.from({ length: 20 }, (_, i) => ({
  policyId: `POLICY_${i + 1}`,
  domainRisk: "Low",
  documentName: `Document ${i + 1}`,
  sgCodeReference: `SG_${i + 1}`,
  policyPublicationDate: "2024-01-01",
  documentType: "Type A",
  busu: `Unit ${i + 1}`,
  implementationDeadlineDate: "2024-12-01",
  dispensationDeadlineDate: "2024-12-01",
  mypnpStatus: "Pending",
}));

/* ================= MAIN ================= */

const DocumentViewPending: React.FC = () => {
  const [data] = useState<DataRow[]>(hardCodedData);

  const columns = useMemo(
    () => [
      {
        name: "policyId",
        label: "Policy ID",
      },
      {
        name: "domainRisk",
        label: "Domain Risk",
      },
      {
        name: "documentName",
        label: "Document Name",
      },
    ],
    []
  );

  return (
    <MUIDataTable
      title="Pending Documents"
      columns={columns}
      data={data}
      options={{
        selectableRows: "none",
        filter: true,        // built-in filter
        viewColumns: true,   // built-in column selector
        download: true,      // built-in CSV download
        print: false,
        responsive: "standard",
      }}
    />
  );
};

export default DocumentViewPending;
