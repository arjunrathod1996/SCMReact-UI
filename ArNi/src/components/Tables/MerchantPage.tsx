import React, { useReducer, useState, useEffect, FormEvent } from 'react';
import MerchantFormModal from '../modal/MerchantFormModal';
import ActionButtons from '../common/ActionButtons';
import BusinessService from '../service/BusinessService';
import LocationService from '../service/LocationService';
import MerchantService from '../service/MerchantService';
import DataTable, { TableColumn } from 'react-data-table-component';
import api from '../api/api';
import MessageDisplay from '../common/MessageModalDisplay';
import { User } from '../../store'; // Import the user type

/** --- 1. Interfaces --- **/

export interface Merchant {
  id: string | number;
  name: string;
  mobileNumber: string;
  displayPhone: string;
  locality: string;
  address: string;
  zone: string;
  business: any; 
  region: any;   
  creationTime?: string;
}

interface MerchantMessages {
  general: string;
  name: string;
  mobileNumber: string;
  displayPhone: string;
  locality: string;
  address: string;
  zone: string;
  business: string;
  region: string;
  modal: string;
}

interface PageState {
  merchant: Merchant;
  messages: MerchantMessages;
}

interface SelectOption {
  value: string | number;
  label: string;
}

// FIXED: Define the Props interface to allow the 'user' prop from App.tsx
interface MerchantPageProps {
  user?: User | null;
}

type Action =
  | { type: "SET_MERCHANT"; payload: Partial<Merchant> }
  | { type: "SET_MESSAGES"; payload: Partial<MerchantMessages> }
  | { type: "RESET" };

/** --- 2. Configuration & Reducer --- **/

const initialState: PageState = {
  merchant: {
    id: '',
    name: '',
    mobileNumber: '',
    displayPhone: '',
    locality: '',
    address: '',
    zone: '',
    business: '',
    region: ''
  },
  messages: {
    general: "",
    name: '',
    mobileNumber: '',
    displayPhone: '',
    locality: '',
    address: '',
    zone: '',
    business: '',
    region: '',
    modal: ""
  }
};

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#f1f5f9",
    },
  },
};

function reducer(state: PageState, action: Action): PageState {
  switch (action.type) {
    case "SET_MERCHANT":
      return { ...state, merchant: { ...state.merchant, ...action.payload } };
    case "SET_MESSAGES":
      return { ...state, messages: { ...state.messages, ...action.payload } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/** --- 3. Main Component --- **/

// FIXED: Updated function signature to accept props
const MerchantPage: React.FC<MerchantPageProps> = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const [data, setData] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRow, setSelectedRow] = useState<Merchant | null>(null);
  
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [businessOptions, setBusinessOptions] = useState<SelectOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([]);

  /** --- 4. API Logic --- **/

  const fetchData = async (page: number = 1, size: number = 10) => {
    setLoading(true);
    try {
      const response = await api.get("/merchantPageWise", {
        params: {
          page: page - 1,
          size,
          sort: "id,desc",
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

  const fetchOptions = async () => {
    try {
      const fetchedBusiness = await BusinessService.searchBusiness('');
      setBusinessOptions(fetchedBusiness.map((b: any) => ({
        value: b.id,
        label: b.name,
      })));

      const response = await LocationService.searchRegion('');
      const regions = response.data || [];
      setRegionOptions(regions.map((r: any) => ({
        value: r.id,
        label: r.city,
      })));
    } catch (error) {
      console.error("Error loading options:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    fetchOptions();
  }, []);

  /** --- 5. Handlers --- **/

  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
    dispatch({ type: "RESET" });
    setIsSubmitting(false);
  };

  const handleEdit = () => {
    if (!selectedRow) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a merchant to edit." } });
      return;
    }
    dispatch({ type: "SET_MERCHANT", payload: selectedRow });
    openModal();
  };

  const handleDelete = async () => {
    if (!selectedRow) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a merchant to delete." } });
      return;
    }
    if (window.confirm("Are you sure you want to delete this merchant?")) {
      try {
        await MerchantService.deleteMerchant(selectedRow.id);
        fetchData(currentPage, rowsPerPage);
        setSelectedRow(null);
      } catch (error) {
        dispatch({ type: "SET_MESSAGES", payload: { general: "Error deleting merchant." } });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { business, region, name } = state.merchant;
    let valid = true;
    const newMessages: Partial<MerchantMessages> = {};

    if (!business) { valid = false; newMessages.business = "Business required"; }
    if (!region) { valid = false; newMessages.region = "Region required"; }
    if (!name) { valid = false; newMessages.name = "Name required"; }
    
    if (!valid) {
      dispatch({ type: "SET_MESSAGES", payload: newMessages as MerchantMessages });
      setIsSubmitting(false);
      return;
    }

    try {
      const businessID = business.id || business;
      const regionID = region.id || region;

      await MerchantService.saveMerchant(state.merchant, state.merchant.id || null, businessID, regionID);
      
      dispatch({ type: "SET_MESSAGES", payload: { modal: "Successfully saved data." } });
      fetchData(currentPage, rowsPerPage);
      setTimeout(closeModal, 2000);
    } catch (error: any) {
      dispatch({ type: "SET_MESSAGES", payload: { modal: "Error saving data." } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowSelected = (row: Merchant) => {
    setSelectedRow(selectedRow?.id === row.id ? null : row);
  };

  /** --- 6. Columns --- **/

  const columns: TableColumn<Merchant>[] = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRow?.id === row.id}
          onChange={() => handleRowSelected(row)}
          className="cursor-pointer"
        />
      ),
      ignoreRowClick: true,
      width: "60px",
    },
    {
      name: "Business",
      selector: (row) => row.business?.name || "",
      sortable: true
    },
    {
      name: "Region",
      selector: (row) => `${row.region?.city || ''} : ${row.region?.zone || ''}`,
      sortable: true
    },
    {
      name: "Locality",
      selector: (row) => row.locality,
      sortable: true
    },
    {
      name: "Date",
      selector: (row) => row.creationTime || "",
      sortable: true
    }
  ];

  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      <MessageDisplay 
        message={state.messages.general} 
        type={state.messages.general.toLowerCase().includes("success") ? "success" : "error"}
        clearMessage={() => dispatch({ type: "SET_MESSAGES", payload: { general: "" } })}
      />

      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">Merchant Management</h1>
      
      <div className="bg-white p-4 shadow-md rounded-lg mb-4">
        <ActionButtons 
          openModal={openModal} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationComponentOptions={{ noRowsPerPage: true }}
          onChangePage={(page) => setCurrentPage(page)}
          customStyles={customStyles}
          highlightOnHover
        />
      </div>

      <MerchantFormModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        businessOptions={businessOptions}
        regionOptions={regionOptions}
        formData={state.merchant}
        setFormData={(data) => dispatch({ type: "SET_MERCHANT", payload: data })}
        handleSubmit={handleSubmit}
        messages={state.messages}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default MerchantPage;