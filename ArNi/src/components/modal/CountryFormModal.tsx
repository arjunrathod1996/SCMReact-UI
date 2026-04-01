import React, { ChangeEvent, FormEvent, FocusEvent } from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import {
  FaGlobe,
  FaCode,
  FaTimes
} from "react-icons/fa";

/** --- 1. Interfaces --- **/

export interface Country {
  id?: string | number;
  callingCode: string;
  name: string;
}

export interface CountryFormMessages {
  general?: string;
  callingCode?: string;
  name?: string;
  modal?: string;
}

interface CountryFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  country: Partial<Country>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (e: FocusEvent<HTMLInputElement>) => void;
  messages: CountryFormMessages;
}

/** --- 2. Component --- **/

const CountryFormModal: React.FC<CountryFormModalProps> = ({
  isOpen,
  closeModal,
  handleSubmit,
  country = {},
  handleChange,
  handleFocus,
  messages = {},
}) => {
  const safeCountry = country || {};

  return (
    <Draggable handle=".drag-handle">
      {/* Note: We wrap the content in a div because Draggable 
        needs a direct DOM child to apply transformations. 
      */}
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Country Form Modal"
          ariaHideApp={false}
          className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl mx-auto mt-20 z-50 focus:outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto z-50"
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Draggable Header */}
          <div className="drag-handle cursor-move pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {safeCountry.id ? "Edit Country" : "Add New Country"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Calling Code */}
              <div className="flex flex-col">
                <label
                  htmlFor="callingCode"
                  className="flex items-center text-sm font-semibold text-gray-600 mb-1"
                >
                  <FaCode className="mr-2 text-blue-500" />
                  Calling Code
                </label>
                <input
                  type="text"
                  id="callingCode"
                  name="callingCode"
                  value={safeCountry.callingCode || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder="e.g. +91"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {messages.callingCode && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{messages.callingCode}</p>
                )}
              </div>

              {/* Country Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-semibold text-gray-600 mb-1"
                >
                  <FaGlobe className="mr-2 text-blue-500" />
                  Country Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={safeCountry.name || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder="e.g. India"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {messages.name && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{messages.name}</p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {safeCountry.id ? "Update Country" : "Save Country"}
              </button>
            </div>

            {/* Modal Response Message */}
            {messages.modal && (
              <div
                className={`mt-4 p-3 text-sm rounded-md border ${
                  messages.modal.startsWith("Error")
                    ? "text-red-700 bg-red-50 border-red-200"
                    : "text-green-700 bg-green-50 border-green-200"
                }`}
              >
                {messages.modal}
              </div>
            )}
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default CountryFormModal;