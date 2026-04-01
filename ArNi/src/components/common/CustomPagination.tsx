import React from 'react';
import { Pagination } from 'react-bootstrap';

// 1. Define the interface for your props
interface CustomPaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  // Define that this function expects a number and returns nothing
  onChangePage: (newPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ 
  page, 
  rowsPerPage, 
  onChangePage, 
  totalRows 
}) => {
  // 2. TypeScript automatically infers that pageCount is a number
  const pageCount = Math.ceil(totalRows / rowsPerPage) || 1;

  return (
    <div className="custom-pagination">
      <Pagination>
        {/* Previous Button */}
        <Pagination.Prev
          onClick={() => page > 1 && onChangePage(page - 1)}
          disabled={page === 1}
        />

        {/* Page Numbers */}
        {[...Array(pageCount)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => onChangePage(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}

        {/* Next Button */}
        <Pagination.Next
          onClick={() => page < pageCount && onChangePage(page + 1)}
          disabled={page === pageCount}
        />
      </Pagination>
    </div>
  );
};

export default CustomPagination;