import React, { useEffect, useState, FormEvent, FocusEvent } from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import Select, { SingleValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaGlobe,
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
} from "react-icons/fa";

/** --- 1. Interfaces --- **/

export interface Customer {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  regionID?: string | number;
  country: { name: string } | string;
  countryID?: string | number;
  birthdate: string | Date;
  mobile: string;
}

export interface CustomerFormMessages {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  birthdate?: string;
  country?: string;
  region?: string;
  modal?: string;
}

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomerFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  customer: Partial<Customer>;
  handleChange: (e: any) => void; // Using any here to accommodate different event shapes from Select/DatePicker
  handleFocus: (e: FocusEvent<any>) => void;
  messages: CustomerFormMessages;
  countryOptions: SelectOption[];
  regionOptions: SelectOption[];
}

/** --- 2. Sub-component for Select --- **/

interface NoOptionsProps {
  inputValue: string;
  filteredOptions: SelectOption[];
}

const NoOptionsMessage: React.FC<NoOptionsProps> = ({ inputValue, filteredOptions }) => {
  if (inputValue.length < 3) {
    return <div className="p-2 text-sm text-gray-500 text-center">Enter 3 characters to search</div>;
  }
  if (filteredOptions.length === 0) {
    return <div className="p-2 text-sm text-gray-500 text-center">Data not found</div>;
  }
  return null;
};

/** --- 3. Main Component --- **/

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  closeModal,
  handleSubmit,
  customer = {},
  handleChange,
  handleFocus,
  messages = {},
  countryOptions = [],
  regionOptions = [],
}) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);

  // Search/Input States
  const [countryInputValue, setCountryInputValue] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(null);
  const [filteredCountryOptions, setFilteredCountryOptions] = useState<SelectOption[]>([]);

  const [regionInputValue, setRegionInputValue] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<SelectOption | null>(null);
  const [filteredRegionOptions, setFilteredRegionOptions] = useState<SelectOption[]>([]);

  // Effect to sync selected options when customer data changes (e.g. on Edit)
  useEffect(() => {
    if (customer?.id) {
      const countryName = typeof customer.country === 'object' ? customer.country.name : customer.country;
      
      setSelectedCountry(
        countryOptions.find((option) => option.label === countryName) || null
      );
      setSelectedRegion(
        regionOptions.find((option) => option.label === customer.region) || null
      );
      setDisabled(true);
    } else {
      setDisabled(false);
      setSelectedCountry(null);
      setSelectedRegion(null);
    }
  }, [customer, countryOptions, regionOptions]);

  // Country Filtering Logic
  useEffect(() => {
    if (countryInputValue.length >= 3) {
      const results = countryOptions.filter((option) =>
        option.label.toLowerCase().includes(countryInputValue.toLowerCase())
      );
      setFilteredCountryOptions(results);
    } else {
      setFilteredCountryOptions([]);
    }
  }, [countryInputValue, countryOptions]);

  // Region Filtering Logic
  useEffect(() => {
    if (regionInputValue.length >= 3) {
      const results = regionOptions.filter((option) =>
        option.label.toLowerCase().includes(regionInputValue.toLowerCase())
      );
      setFilteredRegionOptions(results);
    } else {
      setFilteredRegionOptions([]);
    }
  }, [regionInputValue, regionOptions]);

  const handleCountryChange = (option: SingleValue<SelectOption>) => {
    setSelectedCountry(option);
    handleChange({ target: { name: "country", value: option ? option.label : "" } });
    handleChange({ target: { name: "countryID", value: option ? option.value : "" } });
  };

  const handleRegionChange = (option: SingleValue<SelectOption>) => {
    setSelectedRegion(option);
    handleChange({ target: { name: "region", value: option ? option.label : "" } });
    handleChange({ target: { name: "regionID", value: option ? option.value : "" } });
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl mx-auto mt-10 z-50 focus:outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto z-50"
        >
          {/* Close Icon */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Draggable Header */}
          <div className="drag-handle cursor-move pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {customer?.id ? "Edit Customer" : "Add New Customer"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaUser className="mr-2 text-blue-500" /> First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={customer?.firstName || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.firstName && <p className="mt-1 text-xs text-red-500">{messages.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaUser className="mr-2 text-blue-500" /> Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={customer?.lastName || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.lastName && <p className="mt-1 text-xs text-red-500">{messages.lastName}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaPhone className="mr-2 text-blue-500" /> Mobile
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={customer?.mobile || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.mobile && <p className="mt-1 text-xs text-red-500">{messages.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaEnvelope className="mr-2 text-blue-500" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customer?.email || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.email && <p className="mt-1 text-xs text-red-500">{messages.email}</p>}
              </div>

              {/* Birthdate */}
              <div className="flex flex-col">
                <label htmlFor="birthdate" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaBirthdayCake className="mr-2 text-blue-500" /> Birthdate
                </label>
                <DatePicker
                  selected={customer?.birthdate ? new Date(customer.birthdate) : null}
                  onChange={(date: Date | null) =>
                    handleChange({ target: { name: "birthdate", value: date } })
                  }
                  onFocus={handleFocus}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.birthdate && <p className="mt-1 text-xs text-red-500">{messages.birthdate}</p>}
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label htmlFor="country" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaGlobe className="mr-2 text-blue-500" /> Country
                </label>
                <Select
                  id="country"
                  options={filteredCountryOptions}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  onInputChange={setCountryInputValue}
                  inputValue={countryInputValue}
                  components={{
                    NoOptionsMessage: (props) => (
                      <NoOptionsMessage
                        {...props}
                        inputValue={countryInputValue}
                        filteredOptions={filteredCountryOptions}
                      />
                    ),
                  }}
                  className="text-sm"
                  placeholder="Type 3 chars..."
                />
                {messages.country && <p className="mt-1 text-xs text-red-500">{messages.country}</p>}
              </div>

              {/* Region */}
              <div className="md:col-span-2">
                <label htmlFor="region" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaGlobe className="mr-2 text-blue-500" /> Region
                </label>
                <Select
                  id="region"
                  options={filteredRegionOptions}
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  onInputChange={setRegionInputValue}
                  inputValue={regionInputValue}
                  noOptionsMessage={() => (
                    <NoOptionsMessage
                      inputValue={regionInputValue}
                      filteredOptions={filteredRegionOptions}
                    />
                  )}
                  isDisabled={isDisabled}
                  className="text-sm"
                  placeholder="Select region..."
                />
                {messages.region && <p className="mt-1 text-xs text-red-500">{messages.region}</p>}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all"
                disabled={isDisabled && !!customer?.id}
              >
                {customer?.id ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default CustomerFormModal;