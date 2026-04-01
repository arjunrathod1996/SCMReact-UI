import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import { 
  FaTimes, FaMapMarkedAlt, FaPhone, FaBuilding, FaAddressCard, FaTag, FaMapSigns 
} from "react-icons/fa";
import Select, { SingleValue } from 'react-select';

/** --- 1. Interfaces --- **/

export interface SelectOption {
  label: string;
  value: any;
}

export interface MerchantData {
  id?: string | number;
  business: any; // Can be object or ID depending on your API state
  name: string;
  mobileNumber: string;
  displayPhone: string;
  region: any;
  locality: string;
  address: string;
  category: string;
}

export interface MerchantFormMessages {
  business?: string;
  region?: string;
  name?: string;
  mobileNumber?: string;
  displayPhone?: string;
  locality?: string;
  address?: string;
  modal?: string;
}

interface MerchantFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  businessOptions: SelectOption[];
  regionOptions: SelectOption[];
  formData: Partial<MerchantData>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (data: any) => Promise<void> | void;
  messages: MerchantFormMessages;
  isSubmitting: boolean;
}

/** --- 2. Sub-component for Empty Search Results --- **/

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

const MerchantFormModal: React.FC<MerchantFormModalProps> = ({ 
  isOpen, 
  closeModal, 
  businessOptions, 
  regionOptions, 
  formData, 
  setFormData, 
  handleSubmit, 
  messages, 
  isSubmitting 
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState<SelectOption | null>(null);
  const [filteredBusinessOptions, setFilteredBusinessOptions] = useState<SelectOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const [selectedRegion, setSelectedRegion] = useState<SelectOption | null>(null);
  const [filteredRegionOptions, setFilteredRegionOptions] = useState<SelectOption[]>([]);
  const [regionInputValue, setRegionInputValue] = useState<string>('');

  const [isDisabled, setDisabled] = useState<boolean>(false);

  const defaultFormData: MerchantData = {
    business: '',
    name: '',
    mobileNumber: '',
    displayPhone: '',
    region: '',
    locality: '',
    address: '',
    category: ''
  };

  const currentFormData = { ...defaultFormData, ...formData };

  // Sync Business selection on Edit
  useEffect(() => {
    if (currentFormData.id && currentFormData.business) {
      const businessName = typeof currentFormData.business === 'object' 
        ? currentFormData.business.name 
        : currentFormData.business;
        
      setSelectedBusiness(businessOptions.find(opt => opt.label === businessName) || null);
      setDisabled(true);
    } else {
      setDisabled(false);
      setSelectedBusiness(null);
    }
  }, [currentFormData.id, businessOptions, currentFormData.business]);

  // Sync Region selection on Edit
  useEffect(() => {
    if (currentFormData.id && currentFormData.region) {
      const cityName = typeof currentFormData.region === 'object' 
        ? currentFormData.region.city 
        : currentFormData.region;

      setSelectedRegion(regionOptions.find(opt => opt.label === cityName) || null);
      setDisabled(true);
    } else {
      if (!currentFormData.id) {
        setDisabled(false);
        setSelectedRegion(null);
      }
    }
  }, [currentFormData.id, regionOptions, currentFormData.region]);

  // Search Filtering: Business
  useEffect(() => {
    if (inputValue.length >= 3) {
      const results = businessOptions.filter(opt => 
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredBusinessOptions(results);
    } else {
      setFilteredBusinessOptions([]);
    }
  }, [inputValue, businessOptions]);

  // Search Filtering: Region
  useEffect(() => {
    if (regionInputValue.length >= 3) {
      const results = regionOptions.filter(opt => 
        opt.label.toLowerCase().includes(regionInputValue.toLowerCase())
      );
      setFilteredRegionOptions(results);
    } else {
      setFilteredRegionOptions([]);
    }
  }, [regionInputValue, regionOptions]);

  const handleInputChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...currentFormData, [name]: value });
  };

  const handleBusinessChange = (selectedOption: SingleValue<SelectOption>) => {
    setSelectedBusiness(selectedOption);
    setFormData({ ...currentFormData, business: selectedOption ? selectedOption.value : '' });
  };

  const handleRegionChange = (selectedOption: SingleValue<SelectOption>) => {
    setSelectedRegion(selectedOption);
    setFormData({ ...currentFormData, region: selectedOption ? selectedOption.value : '' });
  };

  const onFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await handleSubmit(currentFormData);
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Merchant Form Modal"
          ariaHideApp={false}
          className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl mx-auto mt-20 focus:outline-none z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto z-50"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Draggable Header */}
          <div className="drag-handle cursor-move pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {currentFormData.id ? "Edit Merchant" : "Add New Merchant"}
            </h2>
          </div>

          <form onSubmit={onFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              {/* Business Select */}
              <div className='md:col-span-2 relative'>
                <label htmlFor="business" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaBuilding className="mr-2 text-blue-500" /> Business
                </label>
                <Select
                  id="business"
                  options={filteredBusinessOptions}
                  value={selectedBusiness}
                  onChange={handleBusinessChange}
                  onInputChange={(val) => setInputValue(val)}
                  inputValue={inputValue}
                  isDisabled={isDisabled}
                  placeholder="Type 3+ chars to search..."
                  components={{
                    NoOptionsMessage: (props) => (
                      <NoOptionsMessage {...props} inputValue={inputValue} filteredOptions={filteredBusinessOptions} />
                    )
                  }}
                />
                {messages.business && <p className="text-red-500 text-xs mt-1">{messages.business}</p>}
              </div>

              {/* Region Select */}
              <div className='md:col-span-2 relative'>
                <label htmlFor="region" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" /> Region / City
                </label>
                <Select
                  id="region"
                  options={filteredRegionOptions}
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  onInputChange={(val) => setRegionInputValue(val)}
                  inputValue={regionInputValue}
                  isDisabled={isDisabled}
                  placeholder="Search city..."
                  components={{
                    NoOptionsMessage: (props) => (
                      <NoOptionsMessage {...props} inputValue={regionInputValue} filteredOptions={filteredRegionOptions} />
                    )
                  }}
                />
                {messages.region && <p className="text-red-500 text-xs mt-1">{messages.region}</p>}
              </div>

              {/* Merchant Name */}
              <div>
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaTag className="mr-2 text-blue-500" /> Merchant Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentFormData.name}
                  onChange={handleInputChangeText}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Store Name"
                />
                {messages.name && <p className="text-red-500 text-xs mt-1">{messages.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaPhone className="mr-2 text-blue-500" /> Mobile
                </label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  value={currentFormData.mobileNumber}
                  onChange={handleInputChangeText}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                {messages.mobileNumber && <p className="text-red-500 text-xs mt-1">{messages.mobileNumber}</p>}
              </div>

              {/* Display Phone */}
              <div>
                <label htmlFor="displayPhone" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaPhone className="mr-2 text-blue-500" /> Display Phone
                </label>
                <input
                  id="displayPhone"
                  name="displayPhone"
                  type="text"
                  value={currentFormData.displayPhone}
                  onChange={handleInputChangeText}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Locality */}
              <div>
                <label htmlFor="locality" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaMapSigns className="mr-2 text-blue-500" /> Locality
                </label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  value={currentFormData.locality}
                  onChange={handleInputChangeText}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div className='md:col-span-2'>
                <label htmlFor="address" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaAddressCard className="mr-2 text-blue-500" /> Full Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={currentFormData.address}
                  onChange={handleInputChangeText}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Response Message */}
            {messages.modal && (
              <div className={`mt-2 p-3 text-sm rounded-md border ${
                messages.modal.toLowerCase().includes('error') 
                  ? 'text-red-700 bg-red-50 border-red-200' 
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                {messages.modal}
              </div>
            )}

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
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (formData.id ? "Update" : "Save")}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default MerchantFormModal;