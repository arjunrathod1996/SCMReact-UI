import React, { useReducer, useEffect, useState, FormEvent, FocusEvent } from "react";
import LocationService from "../service/LocationService";
import MessageDisplay from "../common/MessageModalDisplay";
import ActionButtons from "../common/ActionButtons";
import RegionFormModal from "../modal/RegionFormModal";
import DataTable, { TableColumn } from "react-data-table-component";
import api from "../api/api";
import { Region } from '../service/LocationService'; 
// 1. Import UserProfile to type the new prop
import { User } from "../../store";

/** --- 1. Interfaces --- **/

// FIX: Define props interface to accept the user from App.tsx
interface RegionPageProps {
  user?: User | null;
}

interface RegionMessages {
  general: string;
  state: string;
  city: string;
  zone: string;
  country: string;
  modal: string;
}

interface PageState {
  region: Region;
  messages: RegionMessages;
}

type Action =
  | { type: "SET_REGION"; payload: Partial<Region> }
  | { type: "SET_MESSAGES"; payload: Partial<RegionMessages> }
  | { type: "RESET" };

/** --- 2. Configuration & Reducer --- **/

const initialState: PageState = {
  region: {
    id: "",
    state: "",
    city: "",
    zone: "",
    country: { 
      name: "" 
    }
  },
  messages: {
    general: "",
    state: "",
    city: "",
    zone: "",
    country: "",
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
    case "SET_REGION":
      return { ...state, region: { ...state.region, ...action.payload } };
    case "SET_MESSAGES":
      return { ...state, messages: { ...state.messages, ...action.payload } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/** --- 3. Main Component --- **/

// FIX: Update function signature to accept the 'user' prop
const RegionPage: React.FC<RegionPageProps> = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<Region[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRow, setSelectedRow] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await api.get("/location/regionPageWise", {
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

  /** --- 4. Handlers --- **/

  const handleChange = (e: any) => {
    const name = e.target?.name || e.name;
    const value = e.target?.value || e.value;
    dispatch({ type: "SET_REGION", payload: { [name]: value } });
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch({ type: "SET_MESSAGES", payload: { [name]: "" } });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newMessages: Partial<RegionMessages> = { state: "", city: "", zone: "", country: "", modal: "" };

    if (!state.region.state) { valid = false; newMessages.state = "State is required."; }
    if (!state.region.city) { valid = false; newMessages.city = "City is required."; }
    if (!state.region.zone) { valid = false; newMessages.zone = "Zone is required."; }

    if (!valid) {
      dispatch({ type: "SET_MESSAGES", payload: newMessages });
      return;
    }

    try {
      const payload = {
        ...state.region,
        id: state.region.id || undefined,
      };

      const countryIdToPass = state.region.country?.id;

      if (payload.id) {
        await LocationService.saveRegion(payload as any, payload.id, countryIdToPass);
      } else {
        await LocationService.saveRegion(payload as any, null, countryIdToPass);
      }

      dispatch({ type: "SET_MESSAGES", payload: { modal: "Successfully saved data." } });
      fetchData(currentPage, rowsPerPage);
      setTimeout(closeModal, 2000);
    } catch (error) {
      dispatch({ type: "SET_MESSAGES", payload: { modal: "Error saving region." } });
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
  };

  const handleEdit = () => {
    if (!selectedRow) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a region to edit." } });
      return;
    }
    dispatch({ type: "SET_REGION", payload: selectedRow });
    openModal();
  };

  const handleDelete = async () => {
    if (!selectedRow) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a region to delete." } });
      return;
    }
    if (window.confirm("Are you sure you want to delete this region?")) {
      // Implement delete logic here
    }
  };

  const handleRowSelected = (row: Region) => {
    setSelectedRow(selectedRow?.id === row.id ? null : row);
  };

  const clearGeneralMessage = () => {
    dispatch({ type: "SET_MESSAGES", payload: { general: "" } });
  };

  /** --- 5. Column Definitions --- **/

  const columns: TableColumn<Region>[] = [
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
    { name: "State", selector: (row) => row.state, sortable: true },
    { name: "City", selector: (row) => row.city, sortable: true },
    { name: "Zone", selector: (row) => row.zone, sortable: true },
    { name: "Date", selector: (row) => row.creationTime || "", sortable: true }
  ];

  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      <MessageDisplay 
        message={state.messages.general} 
        type={state.messages.general.toLowerCase().includes("success") ? "success" : "error"}
        clearMessage={clearGeneralMessage}
      />
      
      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">Region Management</h1>
      
      <div className="table-container p-4 bg-white shadow-md rounded-lg">
        <ActionButtons 
          openModal={openModal} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
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
            customStyles={customStyles}
            highlightOnHover
          />
        </div>

        <RegionFormModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          region={state.region}
          handleChange={handleChange}
          handleFocus={handleFocus}
          messages={state.messages}
        />
      </div>
    </div>
  );
}

export default RegionPage;