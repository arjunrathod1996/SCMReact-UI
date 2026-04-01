import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  FocusEvent,
} from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import BusinessService, {
  Business,
  Category,
} from "../service/BusinessService";
import BusinessFormModal from "../modal/BusinessFormModal";
import MessageDisplay from "../common/MessageModalDisplay";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "../../types";
import api from "../api/api";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";

/** --- 1. Interfaces --- **/

interface BusinessMessages {
  general: string;
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
  modal: string;
}

interface BusinessPageProps {
  user?: User | null;
}

/** --- 2. Component --- **/

const BusinessPage: React.FC<BusinessPageProps> = ({ user }) => {
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [data, setData] = useState<Business[]>([]);

  // Search & Pagination States
  const [name, setName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [category, setCategory] = useState<string>(""); // Holds the Category ID for the API
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  // Custom Dropdown States 🚀
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  // Selection & UI States
  const [selectedBusiness, setSelectedBusiness] = useState<
    string | number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const loadTableData = async () => {
    setLoading(true);
    try {
      const hasSearchFilters =
        name || fullName || category || startDate || endDate;

      if (hasSearchFilters) {
        const result = await BusinessService.searchBusinesses(
          name,
          fullName,
          category,
          formatDate(startDate),
          formatDate(endDate),
          currentPage - 1,
          rowsPerPage,
        );

        const responseData = result.data || result;
        const fetchedContent =
          responseData.content !== undefined
            ? responseData.content
            : Array.isArray(responseData)
              ? responseData
              : [];
        const fetchedTotal =
          responseData.totalElements !== undefined
            ? responseData.totalElements
            : fetchedContent.length;

        setData(fetchedContent);
        setTotalRows(fetchedTotal);
      } else {
        const response = await api.get("/businessPageWise", {
          params: {
            page: currentPage - 1,
            size: rowsPerPage,
            sort: "id,desc",
          },
        });
        setData(response.data.content || []);
        setTotalRows(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    loadTableData();
  }, [currentPage, rowsPerPage]);

  /** --- 5. Event Handlers --- **/

  const handleSearchClick = () => {
    if (currentPage === 1) {
      loadTableData();
    } else {
      setCurrentPage(1);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setMessages((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newMessages: Partial<BusinessMessages> = {};

    if (!business.name) {
      valid = false;
      newMessages.name = "Enter name.";
    }
    if (!business.fullName) {
      valid = false;
      newMessages.fullName = "Enter full name.";
    }
    if (!business.address) {
      valid = false;
      newMessages.address = "Enter address.";
    }
    if (!business.category) {
      valid = false;
      newMessages.category = "Select category.";
    }

    if (!valid) {
      setMessages((prev) => ({ ...prev, ...newMessages }));
      return;
    }

    try {
      if (business.id) {
        await BusinessService.updateBusiness(business);
      } else {
        await BusinessService.saveBusiness(business);
      }
      loadTableData();
      closeModal();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Operation failed.";
      setMessages((prev) => ({ ...prev, modal: errorMsg }));
    }
  };

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setBusiness({
      id: "",
      name: "",
      fullName: "",
      address: "",
      description: "",
      category: "",
    });
    setMessages({
      general: "",
      name: "",
      fullName: "",
      address: "",
      description: "",
      category: "",
      modal: "",
    });
  };

  const handleEdit = () => {
    if (!selectedBusiness) {
      setMessages((prev) => ({
        ...prev,
        general: "Select a business to edit.",
      }));
      return;
    }
    const target = data.find((b) => b.id === selectedBusiness);
    if (target) {
      setBusiness(target);
      openModal();
    }
  };

  const handleDelete = () => {
    if (!selectedBusiness) {
      setMessages((prev) => ({
        ...prev,
        general: "Select a business to delete.",
      }));
      return;
    }
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBusiness) return;

    try {
      await BusinessService.deleteBusiness(selectedBusiness);
      loadTableData();
      setSelectedBusiness(null);
      setMessages((prev) => ({ ...prev, general: "Deleted successfully" }));
    } catch {
      setMessages((prev) => ({ ...prev, general: "Delete failed." }));
    } finally {
      setDeleteModalOpen(false);
    }
  };

  /** --- Derived State for Custom Dropdown --- **/
  const searchableCategories = filteredCategories.filter((cat) =>
    (cat.name || cat.toString())
      .toLowerCase()
      .includes(categorySearchTerm.toLowerCase()),
  );

  /** --- 6. Table Columns --- **/

  const columns: TableColumn<Business>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-blue-700">{row.name}</span>
      ),
    },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Address", selector: (row) => row.address, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
  ];

  return (
    <div className="p-4 sm:ml-64 relative z-10">
      <MessageDisplay
        message={messages.general}
        type={messages.general.includes("success") ? "success" : "error"}
        clearMessage={() => setMessages((prev) => ({ ...prev, general: "" }))}
      />

      <h1 className="text-2xl font-bold mb-4 text-gray-400 uppercase tracking-wider">
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

        {/* 🚀 FIXED Searchable Dropdown */}
        <div className="flex flex-col relative w-48">
          <label className="text-xs font-bold text-gray-500 mb-1">
            CATEGORY
          </label>
          <input
            type="text"
            placeholder="All Categories"
            value={categorySearchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setCategorySearchTerm(val);
              setIsCategoryDropdownOpen(true);

              // 👈 FIX 1: If the user types to change the search, clear the hidden category ID
              // so we don't accidentally send an old/stale ID to the backend.
              setCategory("");
            }}
            onFocus={() => setIsCategoryDropdownOpen(true)}
            onBlur={() =>
              setTimeout(() => setIsCategoryDropdownOpen(false), 200)
            }
            className="px-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full"
          />

          {isCategoryDropdownOpen && (
            <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {/* Reset Option */}
              <li>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-gray-700 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCategory("");
                    setCategorySearchTerm("");
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  All Categories
                </button>
              </li>

              {/* Filtered Options */}
              {searchableCategories.map((cat, index) => {
                // 👈 FIX 2: Safely handle categories whether they have an ID or just a string name
                const displayString = cat.name || cat.toString();
                const catValue =
                  cat.id !== undefined ? String(cat.id) : displayString;

                return (
                  <li key={cat.id || index}>
                    <button
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm focus:outline-none transition-colors ${
                        category === catValue
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : "text-gray-700 hover:bg-blue-50 focus:bg-blue-50"
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCategory(catValue); // Sends correct ID or Name to API
                        setCategorySearchTerm(displayString); // Updates the text input
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {displayString}
                    </button>
                  </li>
                );
              })}

              {/* No Results Fallback */}
              {searchableCategories.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-400 select-none">
                  No matches found
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 ">START DATE</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Pick date"
            className="px-3 py-2 border border-gray-200 rounded text-sm outline-none"
          />
        </div>

        <button
          onClick={handleSearchClick}
          className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          SEARCH
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center mb-4 w-full">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={openModal}
            className="bg-green-400 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 shadow-sm transition-all"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
          </button>

          <button
            onClick={handleEdit}
            className="bg-amber-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-amber-600 transition-all"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition-all"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-2">
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={(p) => setCurrentPage(p)}
          onChangeRowsPerPage={(rows) => setRowsPerPage(rows)}
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={(state) =>
            setSelectedBusiness(state.selectedRows[0]?.id || null)
          }
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
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default BusinessPage;
