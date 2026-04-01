import React, { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import BusinessService, { Business, Category } from "../service/BusinessService";
import BusinessFormModal from "../modal/BusinessFormModal";
import MessageDisplay from "../common/MessageModalDisplay";
// import RotatingSquaresSpinner from "../common/RotatingSquaresSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "../../types";

/** --- 1. Interfaces --- **/

interface BusinessMessages {
  general: string;
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
  modal: string; // Unified 'modal' and 'modals'
}

interface BusinessPageProps {
  user?: User | null;
}

/** --- 2. Component --- **/

const BusinessPage: React.FC<BusinessPageProps> = ({ user }) => {
  // Data States
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  // Search & Pagination States
  const [name, setName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  
  // Selection & UI States
  const [selectedBusiness, setSelectedBusiness] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  // Form State
  const [business, setBusiness] = useState<Business>({
    id: "",
    name: "",
    fullName: "",
    address: "",
    description: "",
    category: "",
  });

  const [messages, setMessages] = useState<BusinessMessages>({
    general: "",
    name: "",
    fullName: "",
    address: "",
    description: "",
    category: "",
    modal: "",
  });

  /** --- 3. Helper Functions --- **/

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; 
  };

  /** --- 4. API Logic --- **/

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await BusinessService.fetchCategories();
      setCategories(fetchedCategories as Category[]);
      setFilteredCategories(fetchedCategories as Category[]);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const data = await BusinessService.searchBusinesses(
        name,
        fullName,
        category,
        formatDate(startDate),
        formatDate(endDate),
        page,
        rowsPerPage
      );
      // Assuming backend returns { content: [], totalElements: number }
      setBusinesses(data.content || []);
      setTotalRows(data.totalElements || 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    performSearch();
  }, [name, fullName, category, startDate, endDate, page, rowsPerPage]);

  /** --- 5. Event Handlers --- **/

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusiness(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setMessages(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newMessages: Partial<BusinessMessages> = {};

    if (!business.name) { valid = false; newMessages.name = "Enter name."; }
    if (!business.fullName) { valid = false; newMessages.fullName = "Enter full name."; }
    if (!business.address) { valid = false; newMessages.address = "Enter address."; }
    if (!business.category) { valid = false; newMessages.category = "Select category."; }

    if (!valid) {
      setMessages(prev => ({ ...prev, ...newMessages }));
      return;
    }

    try {
      if (business.id) {
        await BusinessService.updateBusiness(business);
      } else {
        await BusinessService.saveBusiness(business);
      }
      performSearch();
      closeModal();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Operation failed.";
      setMessages(prev => ({ ...prev, modal: errorMsg }));
    }
  };

  const handleDelete = async () => {
    if (!selectedBusiness) {
      setMessages(prev => ({ ...prev, general: "Select a business to delete." }));
      return;
    }
    if (window.confirm("Are you sure?")) {
      try {
        await BusinessService.deleteBusiness(selectedBusiness);
        performSearch();
        setSelectedBusiness(null);
      } catch (error) {
        setMessages(prev => ({ ...prev, general: "Delete failed." }));
      }
    }
  };

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setBusiness({ id: "", name: "", fullName: "", address: "", description: "", category: "" });
    setMessages({ general: "", name: "", fullName: "", address: "", description: "", category: "", modal: "" });
  };

  const handleEdit = () => {
    if (!selectedBusiness) {
      setMessages(prev => ({ ...prev, general: "Select a business to edit." }));
      return;
    }
    const target = businesses.find(b => b.id === selectedBusiness);
    if (target) {
      setBusiness(target);
      openModal();
    }
  };

  /** --- 6. Table Columns --- **/

  const columns: TableColumn<Business>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span className="font-semibold text-blue-700">{row.name}</span>,
    },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Address", selector: (row) => row.address, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
  ];

  return (
    <div className="p-4 sm:ml-64 mt-8 relative z-10">
      <MessageDisplay 
        message={messages.general} 
        type={messages.general.includes("success") ? "success" : "error"}
        clearMessage={() => setMessages(prev => ({ ...prev, general: "" }))}
      />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-400 uppercase tracking-wider">
        Business Registry
      </h1>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">NAME</label>
          <input
            type="text"
            placeholder="Search name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">CATEGORY</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name || cat.toString()}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">START DATE</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Pick date"
            className="px-3 py-2 border border-gray-200 rounded text-sm outline-none"
          />
        </div>

        <button
          onClick={performSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          SEARCH
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openModal}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 shadow-sm transition-all"
        >
          + ADD BUSINESS
        </button>
        <div className="space-x-2">
          <button
            onClick={handleEdit}
            className="bg-amber-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-amber-600 transition-all"
          >
            EDIT
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition-all"
          >
            DELETE
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <DataTable
          columns={columns}
          data={businesses}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={(p) => setPage(p)}
          onChangeRowsPerPage={(rows) => setRowsPerPage(rows)}
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={(state) => setSelectedBusiness(state.selectedRows[0]?.id || null)}
          progressPending={loading}
          highlightOnHover
          pointerOnHover
        />
      </div>

      <BusinessFormModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        business={business}
        handleChange={handleChange}
        handleFocus={handleFocus}
        filteredCategories={filteredCategories}
        messages={messages}
      />
    </div>
  );
};

export default BusinessPage;