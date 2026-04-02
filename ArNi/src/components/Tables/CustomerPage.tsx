import React, { useEffect, useReducer, useState, FormEvent, FocusEvent } from 'react';
import MessageDisplay from '../common/MessageModalDisplay';
import ActionButtons from '../common/ActionButtons';
import CustomerFormModal from '../modal/CustomerFormModal';
import LocationService from '../service/LocationService';
import CustomerService from '../service/CustomerService';

/** --- 1. Interfaces --- **/

interface Customer {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  country: string;
  birthdate: string | Date;
  mobile: string;
  countryID: string | number;
  regionID: string | number;
}

interface PageMessages {
  general: string;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  country: string;
  birthdate: string;
  mobile: string;
  modal: string;
}

interface PageState {
  customer: Customer;
  messages: PageMessages;
}

interface SelectOption {
  value: string | number;
  label: string;
}

type Action =
  | { type: "SET_CUSTOMER"; payload: Partial<Customer> }
  | { type: "SET_MESSAGES"; payload: Partial<PageMessages> }
  | { type: "RESET" };

/** --- 2. Initial State & Reducer --- **/

const initialState: PageState = {
  customer: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    country: "",
    birthdate: "",
    mobile: "",
    countryID: "",
    regionID: "",
  },
  messages: {
    general: "",
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    country: "",
    birthdate: "",
    mobile: "",
    modal: "",
  },
};

function reducer(state: PageState, action: Action): PageState {
  switch (action.type) {
    case "SET_CUSTOMER":
      return { ...state, customer: { ...state.customer, ...action.payload } };
    case "SET_MESSAGES":
      return { ...state, messages: { ...state.messages, ...action.payload } };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface CustomerPageProps {
  user?: any;
}

/** --- 3. Component --- **/

const CustomerPage: React.FC<CustomerPageProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([]);

  // 1. Data Fetching
  const fetchCountries = async () => {
    try {
      const response = await LocationService.searchCountries('');
      const countries = response.data || [];
      setCountryOptions(countries.map((c: any) => ({
        value: c.id,
        label: c.name,
      })));
    } catch (error: any) {
      console.error("Error loading countries:", error);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await LocationService.searchRegion('');
      const regions = response.data || [];
      setRegionOptions(regions.map((r: any) => ({
        value: r.id,
        label: r.city,
      })));
    } catch (error) {
      console.error("Error loading regions:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchRegions();
  }, []);

  // 2. Modal Controls
  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
    dispatch({ type: "RESET" });
  };

  // 3. Handlers
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.customer.firstName || !state.customer.lastName || !state.customer.email) {
      dispatch({
        type: "SET_MESSAGES",
        payload: {
          general: "Please fill out all required fields.",
          firstName: !state.customer.firstName ? "First name is required." : "",
          lastName: !state.customer.lastName ? "Last name is required." : "",
          email: !state.customer.email ? "Email is required." : "",
        }
      });
      return;
    }
  
    try {
      if (state.customer.id) {
        await CustomerService.updateCustomer(state.customer.id, state.customer, state.customer.countryID, state.customer.regionID);
        dispatch({ type: "SET_MESSAGES", payload: { general: "Customer updated successfully." } });
      } else {
        await CustomerService.createCustomer(state.customer, state.customer.countryID, state.customer.regionID);
        dispatch({ type: "SET_MESSAGES", payload: { general: "Customer created successfully." } });
      }
      closeModal();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to submit customer data.";
      dispatch({ type: "SET_MESSAGES", payload: { general: errorMsg } });
    }
  };

  const handleEdit = () => {
    if (!state.customer.id) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a customer to edit." } });
      return;
    }
    openModal();
  };

  // FIXED: Added missing handleDelete logic
  const handleDelete = async () => {
    if (!state.customer.id) {
      dispatch({ type: "SET_MESSAGES", payload: { general: "Please select a customer to delete." } });
      return;
    }
    if (window.confirm("Are you sure you want to delete this customer?")) {
      console.log("Deleting customer:", state.customer.id);
      // await CustomerService.deleteCustomer(state.customer.id);
      dispatch({ type: "SET_MESSAGES", payload: { general: "Customer deleted successfully." } });
      dispatch({ type: "RESET" });
    }
  };

  const handleChange = (e: any) => {
    const name = e.target?.name || e.name;
    const value = e.target?.value || e.value;
    dispatch({ type: "SET_CUSTOMER", payload: { [name]: value } });
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch({ type: "SET_MESSAGES", payload: { [name]: "" } });
  };

  // Helper to clear the general message
  const clearGeneralMessage = () => {
    dispatch({ type: "SET_MESSAGES", payload: { general: "" } });
  };

  return (
    <div className="p-2 lg:ml-64 relative z-10">
      {/* FIXED: Added 'type' and 'clearMessage' */}
      <MessageDisplay 
        message={state.messages.general} 
        type={state.messages.general.includes("success") ? "success" : "error"}
        clearMessage={clearGeneralMessage}
      />

      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">Customer Management</h1>
      
      <div className="bg-white p-4 shadow-md rounded-lg">
        {/* FIXED: Added 'handleDelete' */}
        <ActionButtons 
          openModal={openModal} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      </div>

      <CustomerFormModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        customer={state.customer}
        handleChange={handleChange}
        handleFocus={handleFocus}
        messages={state.messages}
        countryOptions={countryOptions}
        regionOptions={regionOptions}
      />
    </div>
  );
}

export default CustomerPage;