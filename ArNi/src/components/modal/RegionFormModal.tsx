import React, { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from "react";
import Modal from "react-modal";
import Draggable from "react-draggable";
import { FaTimes, FaMapMarkedAlt, FaCity, FaMapSigns, FaSearch } from "react-icons/fa";
import LocationService from "../service/LocationService";

/** --- 1. Interfaces --- **/

export interface Country {
  // Making id optional here resolves the Nested Partial mismatch
  id?: string | number;
  name: string;
}

export interface Region {
  id?: string | number;
  state: string;
  city: string;
  zone: string;
  // Using Partial here ensures nested properties are handled correctly in forms
  country?: Partial<Country>;
  countryID?: string | number;
}

export interface RegionFormMessages {
  state?: string;
  city?: string;
  zone?: string;
  country?: string;
  modal?: string;
}

interface RegionFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSubmit: (e: FormEvent) => void;
  region: Partial<Region>;
  handleChange: (e: any) => void;
  handleFocus: (e: FocusEvent<HTMLInputElement>) => void;
  messages: RegionFormMessages;
}

/** --- 2. Component --- **/

const RegionFormModal: React.FC<RegionFormModalProps> = ({
  isOpen,
  closeModal,
  handleSubmit,
  region = {},
  handleChange,
  handleFocus,
  messages = {},
}) => {
  // Local Search States
  const [searchTerm, setSearchTerm] = useState<string>(region.country?.name || "");
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Partial<Country> | null>(
    region.country ? { id: region.country.id, name: region.country.name } : null
  );
  const [countryMessage, setCountryMessage] = useState<string>("");

  /** --- 3. Effects --- **/

  // Sync state when region prop changes (useful for Edit mode)
  useEffect(() => {
    if (region.id) {
      setSearchTerm(region.country?.name || "");
      setSelectedCountry(region.country || null);
    } else {
      setSearchTerm("");
      setSelectedCountry(null);
    }
  }, [region]);

  // Fetch Country Suggestions with Debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length >= 3 && (!selectedCountry || searchTerm !== selectedCountry.name)) {
        try {
          const result = await LocationService.searchCountries(searchTerm);
          // Fixed: Accessing .data from AxiosResponse
          if (result && result.data) {
            setSuggestions(result.data);
          }
        } catch (error) {
          console.error("Error fetching country suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCountry]);

  /** --- 4. Event Handlers --- **/

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (selectedCountry && value !== selectedCountry.name) {
      setSelectedCountry(null);
      // Update parent state
      handleChange({ target: { name: "countryID", value: "" } });
      handleChange({ target: { name: "country", value: "" } });
    }
  };

  const handleSuggestionClick = (suggestion: Country) => {
    setSearchTerm(suggestion.name);
    setSelectedCountry(suggestion);
    setSuggestions([]);
    setCountryMessage("");
    
    // Update parent state fields
    handleChange({ target: { name: "country", value: suggestion.name } });
    handleChange({ target: { name: "countryID", value: suggestion.id } });
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) {
      setCountryMessage("Please select a country from the suggestions.");
      return;
    }
    handleSubmit(e);
  };

  /** --- 5. Render --- **/

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Region Form Modal"
          ariaHideApp={false}
          className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-2xl mx-auto mt-20 z-50 focus:outline-none"
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
              {region.id ? "Edit Region" : "Add New Region"}
            </h2>
          </div>

          <form onSubmit={onFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              
              {/* Country Search */}
              <div className="md:col-span-2 relative">
                <label htmlFor="country" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaSearch className="mr-2 text-blue-500" />
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={(e) => handleFocus(e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Type 3+ chars to search..."
                />
                
                {suggestions.length > 0 && (
                  <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-xl max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-700 transition-colors border-b last:border-b-0"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                
                <input type="hidden" name="countryID" value={selectedCountry?.id || ""} />
                {countryMessage && <p className="mt-1 text-xs text-red-500 font-medium">{countryMessage}</p>}
              </div>

              {/* State */}
              <div className="flex flex-col">
                <label htmlFor="state" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" />
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={region.state || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.state && <p className="mt-1 text-xs text-red-500">{messages.state}</p>}
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label htmlFor="city" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaCity className="mr-2 text-blue-500" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={region.city || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.city && <p className="mt-1 text-xs text-red-500">{messages.city}</p>}
              </div>

              {/* Zone */}
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="zone" className="flex items-center text-sm font-semibold text-gray-600 mb-1">
                  <FaMapSigns className="mr-2 text-blue-500" />
                  Zone / District
                </label>
                <input
                  type="text"
                  id="zone"
                  name="zone"
                  value={region.zone || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {messages.zone && <p className="mt-1 text-xs text-red-500">{messages.zone}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 shadow-sm"
              >
                {region.id ? "UPDATE" : "SAVE"}
              </button>
            </div>

            {/* Status Message */}
            {messages.modal && (
              <div className={`mt-4 p-3 text-sm rounded border ${
                messages.modal.toLowerCase().includes('error') 
                  ? 'text-red-700 bg-red-50 border-red-200' 
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                {messages.modal}
              </div>
            )}
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default RegionFormModal;