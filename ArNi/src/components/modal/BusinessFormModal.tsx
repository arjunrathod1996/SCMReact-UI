import React, { FormEvent, FocusEvent } from "react";
import Modal from "react-modal";
import Draggable from "react-draggable";
import {
  FaTimes,
  FaBusinessTime,
  FaHome,
  FaTag,
  FaFileAlt,
} from "react-icons/fa";
import Select, { SingleValue } from 'react-select';

/** --- 1. Interfaces --- **/

export interface Business {
  id?: string | number;
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
}

export interface FormMessages {
  general?: string;
  name?: string;
  fullName?: string;
  address?: string;
  description?: string;
  category?: string;
  modal?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface BusinessFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  business: Partial<Business>;
  // Using any here to handle combined Input/TextArea/Select events from the parent
  handleChange: (e: any) => void; 
  handleFocus: (e: FocusEvent<any>) => void;
  // FIX: Added '?' to make this prop optional and avoid ts(2741)
  handleCategoryChange?: (e: { target: { name: string; value: string } }) => void;
  filteredCategories: any[];
  messages: FormMessages;
}

/** --- 2. Component --- **/

const BusinessFormModal: React.FC<BusinessFormModalProps> = ({
  isOpen,
  closeModal,
  handleSubmit,
  business = {},
  handleChange,
  handleFocus,
  handleCategoryChange,
  filteredCategories = [],
  messages = {},
}) => {
  
  // Safely initialize values
  const safeBusiness = {
    name: business.name || "",
    fullName: business.fullName || "",
    address: business.address || "",
    description: business.description || "",
    category: business.category || "",
    id: business.id,
  };

  // Map categories to React-Select options
  const categoryOptions: SelectOption[] = filteredCategories.map((cat) => {
    const val = typeof cat === 'string' ? cat : (cat.name || cat.id || "");
    return { value: val, label: val };
  });

  const selectedCategory = categoryOptions.find(
    (option) => option.value === safeBusiness.category
  ) || null;

  // Internal selection logic
  const handleCategorySelect = (selectedOption: SingleValue<SelectOption>) => {
    const eventPayload = {
      target: { name: "category", value: selectedOption?.value || "" },
    };

    // If parent provided a specific handler, use it; otherwise use generic handleChange
    if (handleCategoryChange) {
      handleCategoryChange(eventPayload);
    } else {
      handleChange(eventPayload);
    }
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Business Form Modal"
          ariaHideApp={false}
          className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl mx-auto mt-20 z-50 focus:outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto z-50"
        >
          {/* Close Header */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="drag-handle cursor-move pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {safeBusiness.id ? "Edit Business" : "Add New Business"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              
              {/* Short Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaBusinessTime className="mr-2 text-blue-500" /> Short Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={safeBusiness.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.name && <p className="mt-1 text-xs text-red-500 font-medium">{messages.name}</p>}
              </div>

              {/* Full Name */}
              <div className="flex flex-col">
                <label htmlFor="fullName" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaBusinessTime className="mr-2 text-blue-500" /> Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={safeBusiness.fullName}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.fullName && <p className="mt-1 text-xs text-red-500 font-medium">{messages.fullName}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="address" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaHome className="mr-2 text-blue-500" /> Office Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={safeBusiness.address}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.address && <p className="mt-1 text-xs text-red-500 font-medium">{messages.address}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaFileAlt className="mr-2 text-blue-500" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={safeBusiness.description}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
                {messages.description && <p className="mt-1 text-xs text-red-500 font-medium">{messages.description}</p>}
              </div>

              {/* Category Select */}
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="category" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaTag className="mr-2 text-blue-500" /> Business Category
                </label>
                <Select
                  id="category"
                  instanceId="business-category-select"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategorySelect}
                  onFocus={handleFocus}
                  className="text-sm"
                  placeholder="Choose category..."
                />
                {messages.category && <p className="mt-1 text-xs text-red-500 font-medium">{messages.category}</p>}
              </div>
            </div>

            {/* Modal Error/Success Messages */}
            {messages.modal && (
              <div className={`mt-2 p-3 text-sm rounded-md border ${
                messages.modal.toLowerCase().includes('error') 
                  ? 'text-red-700 bg-red-50 border-red-200' 
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                {messages.modal}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-all active:scale-95"
              >
                {safeBusiness.id ? "UPDATE" : "SAVE"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default BusinessFormModal;