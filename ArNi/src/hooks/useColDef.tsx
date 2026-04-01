// import { MUIDataTableColumn } from "mui-datatables";

// export const useColDef = (display = true) => {
    
//     // Define each column with appropriate field names and options
//     const policyId: MUIDataTableColumn = {
//         name: "policyId",
//         label: "Policy ID",
//         options: { display },
//     };

//     const domainRisk: MUIDataTableColumn = {
//         name: "domainRisk",
//         label: "Domain Risk",
//         options: { display },
//     };

//     const documentName: MUIDataTableColumn = {
//         name: "documentName",
//         label: "Document Name",
//         options: { display },
//     };

//     const sgCodeReference: MUIDataTableColumn = {
//         name: "sgCodeReference",
//         label: "SG Code Reference",
//         options: { display },
//     };

//     const policyPublicationDate: MUIDataTableColumn = {
//         name: "policyPublicationDate",
//         label: "Policy Publication Date",
//         options: { display },
//     };

//     const documentType: MUIDataTableColumn = {
//         name: "documentType",
//         label: "Document Type",
//         options: { display },
//     };

//     const busu: MUIDataTableColumn = {
//         name: "busu",
//         label: "Business Unit",
//         options: { display },
//     };

//     const implementationDeadlineDate: MUIDataTableColumn = {
//         name: "implementationDeadlineDate",
//         label: "Implementation Deadline",
//         options: { display },
//     };

//     const dispensationDeadlineDate: MUIDataTableColumn = {
//         name: "dispensationDeadlineDate",
//         label: "Dispensation Deadline",
//         options: { display },
//     };

//     const mypnpStatus: MUIDataTableColumn = {
//         name: "mypnpStatus",
//         label: "My PnP Status",
//         options: { display },
//     };

//     // Combine all the columns into the array
//     const myPendingActionDocumentList: MUIDataTableColumn[] = [
//         policyId,
//         domainRisk,
//         documentName,
//         sgCodeReference,
//         policyPublicationDate,
//         documentType,
//         busu,
//         implementationDeadlineDate,
//         dispensationDeadlineDate,
//         mypnpStatus,
//     ];

//     return {
//         myPendingActionDocumentList,
//     };
// };


import { MUIDataTableColumn } from 'mui-datatables';

export const useColDef = (display = true) => {
    // Define each column with appropriate field names and options
    const policyId: MUIDataTableColumn = {
        name: "policyId",
        label: "Policy ID",
        options: {
            display,
            sort: true,
            customBodyRender: (value) => (
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{value}</div>
            ),
        },
    };

    const domainRisk: MUIDataTableColumn = {
        name: "domainRisk",
        label: "Domain Risk",
        options: {
            display,
            sort: true,
        },
    };

    const documentName: MUIDataTableColumn = {
        name: "documentName",
        label: "Document Name",
        options: {
            display,
            sort: true,
            customBodyRender: (value) => (
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{value}</div>
            ),
        },
    };

    const sgCodeReference: MUIDataTableColumn = {
        name: "sgCodeReference",
        label: "SG Code Reference",
        options: {
            display,
            sort: true,
        },
    };

    const policyPublicationDate: MUIDataTableColumn = {
        name: "policyPublicationDate",
        label: "Policy Publication Date",
        options: {
            display,
            sort: true,
        },
    };

    const documentType: MUIDataTableColumn = {
        name: "documentType",
        label: "Document Type",
        options: {
            display,
            sort: true,
        },
    };

    const busu: MUIDataTableColumn = {
        name: "busu",
        label: "Business Unit",
        options: {
            display,
            sort: true,
        },
    };

    const implementationDeadlineDate: MUIDataTableColumn = {
        name: "implementationDeadlineDate",
        label: "Implementation Deadline",
        options: {
            display,
            sort: true,
        },
    };

    const dispensationDeadlineDate: MUIDataTableColumn = {
        name: "dispensationDeadlineDate",
        label: "Dispensation Deadline",
        options: {
            display,
            sort: true,
        },
    };

    const mypnpStatus: MUIDataTableColumn = {
        name: "mypnpStatus",
        label: "My PnP Status",
        options: {
            display,
            sort: true,
        },
    };

    // Combine all the columns into the array
    const myPendingActionDocumentList: MUIDataTableColumn[] = [
        policyId,
        domainRisk,
        documentName,
        sgCodeReference,
        policyPublicationDate,
        documentType,
        busu,
        implementationDeadlineDate,
        dispensationDeadlineDate,
        mypnpStatus,
    ];

    return {
        myPendingActionDocumentList,
    };
};
