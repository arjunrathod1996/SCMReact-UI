import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

// 1. Define a generic type for your Row Data
// You can replace 'any' with your UserProfile or other specific interfaces
interface DataRow {
  id?: number | string;
  [key: string]: any; 
}

// 2. Define the response structure from your API
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

// 3. Define Props
interface TableComponentProps {
  url: string;
  columnsConfigKey: string;
  // Passing columnsConfig as a prop or importing it is safer in TS
  columnsConfig: Record<string, TableColumn<DataRow>[]>;
  fetchData: (url: string, params: any) => Promise<PaginatedResponse<DataRow>>;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  url, 
  columnsConfigKey, 
  columnsConfig,
  fetchData 
}) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetchData(url, {
          page: page - 1,
          size: perPage,
          query: filterText,
        });
        setData(response.content);
        setTotalRows(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [url, page, perPage, filterText, fetchData]);

  // 4. Memoize columns with correct typing
  const columns = useMemo(() => columnsConfig[columnsConfigKey] || [], [columnsConfig, columnsConfigKey]);

  const handleFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    setPage(1);
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <input
          type="text"
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
          placeholder="Search..."
          value={filterText}
          onChange={handleFilter}
        />
      </div>
      
      <DataTable
        title="Data Table"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(newPerPage) => setPerPage(newPerPage)}
        onChangePage={(newPage) => setPage(newPage)}
        paginationComponentOptions={paginationComponentOptions}
        highlightOnHover
        pointerOnHover
        responsive
      />
    </div>
  );
};

export default TableComponent;