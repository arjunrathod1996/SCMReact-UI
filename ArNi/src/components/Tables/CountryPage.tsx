import React, { useReducer, useEffect, useState, ChangeEvent, FormEvent } from "react";
import LocationService from "../service/LocationService"; // Cleaned up extensions for TS compatibility
import MessageDisplay from "../common/MessageModalDisplay";
import ActionButtons from "../common/ActionButtons";
import CountryFormModal from "../modal/CountryFormModal";
import DataTable, { TableColumn } from "react-data-table-component";
import api from "../api/api";
import { User } from "../../store"; // Ensure this import is correct

/** --- 1. Interfaces & Types --- **/

export interface Country {
  id: string | number;
  callingCode: string;
  name: string;
  creationTime?: string;
}

export interface CountryMessages {
  general: string;
  callingCode: string;
  name: string;
  modal: string;
}

interface CountryState {
  country: Country;
  messages: CountryMessages;
}

// FIXED: Define the Props interface to accept 'user' from App.tsx
interface CountryPageProps {
  user?: User | null;
}

type Action =
  | { type: "SET_COUNTRY"; payload: Partial<Country> }
  | { type: "SET_MESSAGES"; payload: Partial<CountryMessages> }
  | { type: "RESET" };

/** --- 2. Initial State & Reducer --- **/

const initialState: CountryState = {
  country: {
    id: "",
    callingCode: "",
    name: "",
  },
  messages: {
    general: "",
    callingCode: "",
    name: "",
    modal: "",
  },
};

function reducer(state: CountryState, action: Action): CountryState {
  switch (action.type) {
    case "SET_COUNTRY":
      return { ...state, country: { ...state.country, ...action.payload } };
    case "SET_MESSAGES":
      return { ...state, messages: { ...state.messages, ...action.payload } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/** --- 3. Main Component --- **/

// FIXED: Added React.FC with CountryPageProps
const CountryPage: React.FC<CountryPageProps> = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);
  const [selectedRow, setSelectedRow] = useState<Country | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.get("/location/countryPageWise", {
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

  /** --- 4. Event Handlers --- **/

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_COUNTRY", payload: { [name]: value } });
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch({ type: "SET_MESSAGES", payload: { [name]: "" } });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newMessages: Partial<CountryMessages> = {
      callingCode: "",
      name: "",
      modal: "",
    };

    if (!state.country.callingCode) {
      valid = false;
      newMessages.callingCode = "Please enter a calling code.";
    }
    if (!state.country.name) {
      valid = false;
      newMessages.name = "Please enter a country name.";
    }

    if (!valid) {
      dispatch({ type: "SET_MESSAGES", payload: newMessages });
      return;
    }

    try {
      await LocationService.saveCountry(state.country);
      
      dispatch({ 
        type: "SET_MESSAGES", 
        payload: { modal: "Successfully saved data." } 
      });
      
      fetchData(currentPage, rowsPerPage);
    } catch (error: any) {
      console.error("Error saving/updating country:", error);
      dispatch({ 
        type: "SET_MESSAGES", 
        payload: { modal: "Error saving/updating country. Please try again." } 
      });
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
    dispatch({ type: "RESET" });
    setSelectedRow(null);
  };

  const handleEdit = () => {
    if (!selectedRow) {
      dispatch({
        type: "SET_MESSAGES",
        payload: { general: "Please select a country to edit." },
      });
      return;
    }
    dispatch({ type: "SET_COUNTRY", payload: selectedRow });
    openModal();
  };

  // Auto-close modal on success
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (state.messages.modal === "Successfully saved data.") {
      timer = setTimeout(() => {
        closeModal();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [state.messages.modal]);

  const handleRowSelected = (row: Country) => {
    setSelectedRow(selectedRow?.id === row.id ? null : row);
  };

  /** --- 5. Column Definitions --- **/

  const columns: TableColumn<Country>[] = [
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
      width: "60px"
    },
    {
      name: "Calling Code",
      selector: (row) => row.callingCode,
      sortable: true,
    },
    {
      name: "Country Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.creationTime || "",
      sortable: true,
    },
  ];

  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      <MessageDisplay 
        message={state.messages.general} 
        type="error" 
        clearMessage={() => dispatch({ type: "SET_MESSAGES", payload: { general: "" } })} 
      />
      
      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">
        Country Management
      </h1>
      
      <div className="table-container p-4 bg-white shadow-md rounded-lg">
        <ActionButtons 
          openModal={openModal} 
          handleEdit={handleEdit} 
          handleDelete={() => {}} 
        />
        
        <div className="overflow-x-auto mt-4">
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangePage={(page) => setCurrentPage(page)}
            highlightOnHover
            responsive
          />
        </div>

        <CountryFormModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          country={state.country}
          handleChange={handleChange}
          handleFocus={handleFocus}
          messages={state.messages}
        />
      </div>
    </div>
  );
};

export default CountryPage;