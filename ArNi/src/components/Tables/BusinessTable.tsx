import React, { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import api from "../api/api";
import MessageDisplay from "../common/MessageModalDisplay";
import ActionButtons from "../common/ActionButtons";
import BusinessFormModal from "../modal/BusinessFormModal";
import BusinessService from "../service/BusinessService";

/** --- 1. Interfaces --- **/

// src/types/index.ts
export interface Business {
  id?: string | number; // Optional allows for unsaved data
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
  creationTime?: string;
}

export interface Category {
  id: number | string;
  name: string;
}

export interface FormMessages {
  general: string;
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
  modal: string;
}

interface FilterState {
  name: string | null;
  fullName: string | null;
  category: string | null;
  startDate: string | null;
  endDate: string | null;
}

// FIXED: Define the props interface to accept 'businesses' from the parent
interface BusinessTableProps {
  businesses: Business[]; // Optional, in case you want to use the internal fetch instead
}

/** --- 2. Component --- **/

// FIXED: Added <BusinessTableProps> here
const BusinessTable: React.FC<BusinessTableProps> = ({ businesses }) => {
  // Data States
  const [data, setData] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  
  // Table States
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);

  // Search/Filter States
  const [nameSearch, setNameSearch] = useState<string>("");
  const [fullNameSearch, setFullNameSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    name: null,
    fullName: null,
    category: null,
    startDate: null,
    endDate: null,
  });

  // UI & Form States
  const [selectedRow, setSelectedRow] = useState<Business | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [businessForm, setBusinessForm] = useState<Business>({
    id: "",
    name: "",
    fullName: "",
    address: "",
    description: "",
    category: "",
  });

  const [messages, setMessages] = useState<FormMessages>({
    general: "",
    name: "",
    fullName: "",
    address: "",
    description: "",
    category: "",
    modal: "",
  });

  /** --- 3. Data Fetching --- **/

  // Sync internal data if the parent passes businesses prop
  useEffect(() => {
    if (businesses) {
      setData(businesses);
      setLoading(false);
    }
  }, [businesses]);

  const fetchData = async (page: number = 1, size: number = 10, currentFilters: Partial<FilterState> = {}) => {
    // Only fetch if parent didn't provide data
    if (businesses) return; 

    setLoading(true);
    try {
      const response = await api.get("/businessPageWise", {
        params: {
          page: page - 1,
          size,
          sort: "id,desc",
          ...currentFilters,
        },
      });
      setData(response.data.content || []); 
      setTotalRows(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, filters);
  }, [currentPage, rowsPerPage, filters, businesses]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await BusinessService.fetchCategories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  /** --- 4. Handlers --- **/

  const handleSearch = (): void => {
    setFilters({
      name: nameSearch || null,
      fullName: fullNameSearch || null,
      category: null,
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      endDate: endDate ? endDate.toISOString().split("T")[0] : null,
    });
    setCurrentPage(1);
  };

  const handleRowSelected = (row: Business): void => {
    setSelectedRow(selectedRow?.id === row.id ? null : row);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setBusinessForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: { target: { name: string; value: string } }): void => {
    const { name, value } = e.target;
    setBusinessForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e: FocusEvent<any>): void => {
    const { name } = (e.target as any);
    setMessages((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    let valid = true;
    const newMessages = { ...messages, name: "", fullName: "", address: "", description: "", modal: "" };

    if (!businessForm.name) { valid = false; newMessages.name = "Name is required."; }
    if (!businessForm.fullName) { valid = false; newMessages.fullName = "Full Name is required."; }
    if (!businessForm.address) { valid = false; newMessages.address = "Address is required."; }

    if (!valid) {
      setMessages(newMessages);
      return;
    }

    try {
      if (businessForm.id) {
        await BusinessService.updateBusiness(businessForm);
      } else {
        await BusinessService.saveBusiness(businessForm);
      }
      closeModal();
      fetchData(currentPage, rowsPerPage, filters);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error saving data.";
      setMessages({ ...newMessages, modal: errorMsg });
    }
  };

  const handleEdit = (): void => {
    if (!selectedRow) {
      setMessages((prev) => ({ ...prev, general: "Please select a business to edit." }));
      return;
    }
    setBusinessForm(selectedRow);
    openModal();
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedRow) {
      setMessages((prev) => ({ ...prev, general: "Please select a business to delete." }));
      return;
    }
    if (window.confirm("Are you sure?")) {
      try {
        if (selectedRow.id !== undefined) {
          await BusinessService.deleteBusiness(selectedRow.id);
          fetchData(currentPage, rowsPerPage, filters);
          setSelectedRow(null);
        } else {
          setMessages((prev) => ({ ...prev, general: "Selected business has no valid ID." }));
        }
      } catch (error) {
        setMessages((prev) => ({ ...prev, general: "Error deleting business." }));
      }
    }
  };

  const openModal = (): void => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = (): void => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
    setBusinessForm({ id: "", name: "", fullName: "", address: "", description: "", category: "" });
    setMessages({ general: "", name: "", fullName: "", address: "", description: "", category: "", modal: "" });
  };

  /** --- 5. Columns --- **/

  const columns: TableColumn<Business>[] = [
    {
      name: "Select",
      cell: (row: Business) => (
        <input
          type="checkbox"
          checked={selectedRow?.id === row.id}
          onChange={() => handleRowSelected(row)}
          className="cursor-pointer"
        />
      ),
      width: "60px",
    },
    { name: "Name", selector: (row: Business) => row.name, sortable: true },
    { name: "Full Name", selector: (row: Business) => row.fullName, sortable: true },
    { name: "Category", selector: (row: Business) => row.category, sortable: true },
    { name: "Date", selector: (row: Business) => row.creationTime || "", sortable: true },
  ];

  /** --- 6. Render --- **/

  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      <MessageDisplay 
        message={messages.general} 
        type="error" 
        clearMessage={() => setMessages(prev => ({...prev, general: ""}))} 
      />
      
      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">
        Business Management
      </h1>

      {/* Filters Section */}
      <div className="filters mb-4 p-4 bg-white shadow-md rounded-lg flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Name</label>
          <input
            type="text"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Full Name</label>
          <input
            type="text"
            value={fullNameSearch}
            onChange={(e) => setFullNameSearch(e.target.value)}
            className="p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="p-2 border border-gray-200 rounded text-sm w-32"
          />
        </div>

        <button
          onClick={handleSearch}
          className="h-10 px-6 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        >
          SEARCH
        </button>
      </div>

      {/* Table & Actions */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <ActionButtons
          openModal={openModal}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          paginationServer={!businesses} // Only server-side if no props passed
          paginationTotalRows={totalRows}
          onChangePage={(p) => setCurrentPage(p)}
          highlightOnHover
        />
      </div>

      <BusinessFormModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        business={businessForm}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleCategoryChange={handleCategoryChange}
        filteredCategories={categories}
        messages={messages}
      />
    </div>
  );
};

export default BusinessTable;