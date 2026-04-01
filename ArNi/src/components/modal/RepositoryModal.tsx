import React, { useState, useEffect, FormEvent } from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import { FaTimes, FaBuilding } from "react-icons/fa";
import Select, { MultiValue, StylesConfig } from "react-select";

/** --- 1. Interfaces --- **/

export interface SelectOption {
  value: string;
  label: string;
}

export interface RepositoryData {
  id?: string | number;
  business: string; // Used for Document Type join string
  region: string;   // Used for Domain Risk/Busu join string
  mobileNumber?: string;
  displayPhone?: string;
  locality?: string;
  address?: string;
  category?: string;
}

interface RepositoryModalProps {
  isOpen: boolean;
  closeModal: () => void;
  documentTypeOptions: SelectOption[];
  domainRiskOptions: SelectOption[];
  busuOptions: SelectOption[];
  formData: Partial<RepositoryData>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  messages: Record<string, string>;
  isSubmitting: boolean;
}

/** --- 2. Component --- **/

const RepositoryModal: React.FC<RepositoryModalProps> = ({
  isOpen,
  closeModal,
  documentTypeOptions,
  domainRiskOptions,
  busuOptions,
  formData,
  setFormData,
  handleSubmit,
  messages,
  isSubmitting,
}) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState<MultiValue<SelectOption>>([]);
  const [filteredDocumentTypeOptions, setFilteredDocumentTypeOptions] = useState<SelectOption[]>([]);

  const [selectedDomainRisk, setSelectedDomainRisk] = useState<MultiValue<SelectOption>>([]);
  const [filteredDomainRiskOptions, setFilteredDomainRiskOptions] = useState<SelectOption[]>([]);

  const [selectedBusu, setSelectedBusu] = useState<MultiValue<SelectOption>>([]);
  const [filteredBusuOptions, setFilteredBusuOptions] = useState<SelectOption[]>([]);

  const [isDisabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    setDisabled(!!formData.id);
  }, [formData.id]);

  /** --- Multi-Select Logic with "Select All" --- **/

  const updateFilteredOptions = (
    options: SelectOption[],
    selected: MultiValue<SelectOption>,
    setter: React.Dispatch<React.SetStateAction<SelectOption[]>>
  ) => {
    if (options.length === 0) {
      setter([{ value: "no_options", label: "No options available" }]);
      return;
    }
    const hasSelectAll = selected.length === options.length;
    const finalOptions = hasSelectAll 
      ? options 
      : [{ value: "select_all", label: "Select All" }, ...options];
    setter(finalOptions);
  };

  useEffect(() => {
    updateFilteredOptions(documentTypeOptions, selectedDocumentType, setFilteredDocumentTypeOptions);
  }, [documentTypeOptions, selectedDocumentType]);

  useEffect(() => {
    updateFilteredOptions(domainRiskOptions, selectedDomainRisk, setFilteredDomainRiskOptions);
  }, [domainRiskOptions, selectedDomainRisk]);

  useEffect(() => {
    updateFilteredOptions(busuOptions, selectedBusu, setFilteredBusuOptions);
  }, [busuOptions, selectedBusu]);

  const handleSelectAllLogic = (
    incomingSelected: MultiValue<SelectOption>,
    baseOptions: SelectOption[],
    currentSelected: MultiValue<SelectOption>,
    setSelected: React.Dispatch<React.SetStateAction<MultiValue<SelectOption>>>,
    formKey: keyof RepositoryData
  ) => {
    const isSelectAllTriggered = incomingSelected.some(opt => opt.value === "select_all");

    if (isSelectAllTriggered) {
      // Toggle logic: If already full, clear all. Otherwise, select all.
      if (currentSelected.length === baseOptions.length) {
        setSelected([]);
        setFormData((prev: any) => ({ ...prev, [formKey]: "" }));
      } else {
        setSelected(baseOptions);
        setFormData((prev: any) => ({
          ...prev,
          [formKey]: baseOptions.map(opt => opt.value).join(","),
        }));
      }
    } else {
      setSelected(incomingSelected);
      setFormData((prev: any) => ({
        ...prev,
        [formKey]: incomingSelected.map(opt => opt.value).join(","),
      }));
    }
  };

  const customSelectStyles: StylesConfig<SelectOption, true> = {
    menu: (provided) => ({
      ...provided,
      maxHeight: 150,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 150,
    }),
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Repository Form Modal"
          ariaHideApp={false}
          className="relative w-full max-w-3xl p-0 bg-white rounded-lg shadow-2xl mx-auto mt-10 focus:outline-none z-50 max-h-[90vh] flex flex-col"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          {/* Header */}
          <div className="drag-handle cursor-move flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
            <h2 className="uppercase text-sm font-bold text-gray-700">
              {formData.id ? "Edit Repository" : "Add New Repository"}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Document Type */}
                <div className="relative">
                  <label htmlFor="documentType" className="flex items-center text-xs font-semibold text-gray-500 uppercase mb-1">
                    <FaBuilding className="mr-2 text-blue-500" /> Document Type
                  </label>
                  <Select
                    id="documentType"
                    isMulti
                    options={filteredDocumentTypeOptions}
                    value={selectedDocumentType}
                    onChange={(val) => handleSelectAllLogic(val, documentTypeOptions, selectedDocumentType, setSelectedDocumentType, "business")}
                    styles={customSelectStyles}
                    placeholder="Select types..."
                    className="text-sm"
                    isDisabled={isDisabled}
                  />
                </div>

                {/* Domain Risks */}
                <div className="relative">
                  <label htmlFor="domainRisk" className="flex items-center text-xs font-semibold text-gray-500 uppercase mb-1">
                    <FaBuilding className="mr-2 text-blue-500" /> Domain Risks
                  </label>
                  <Select
                    id="domainRisk"
                    isMulti
                    options={filteredDomainRiskOptions}
                    value={selectedDomainRisk}
                    onChange={(val) => handleSelectAllLogic(val, domainRiskOptions, selectedDomainRisk, setSelectedDomainRisk, "region")}
                    styles={customSelectStyles}
                    placeholder="Select risks..."
                    className="text-sm"
                    isDisabled={isDisabled}
                  />
                </div>

                {/* Busu */}
                <div className="md:col-span-2 relative">
                  <label htmlFor="busu" className="flex items-center text-xs font-semibold text-gray-500 uppercase mb-1">
                    <FaBuilding className="mr-2 text-blue-500" /> Busu
                  </label>
                  <Select
                    id="busu"
                    isMulti
                    options={filteredBusuOptions}
                    value={selectedBusu}
                    onChange={(val) => handleSelectAllLogic(val, busuOptions, selectedBusu, setSelectedBusu, "region")}
                    styles={customSelectStyles}
                    placeholder="Select Busu..."
                    className="text-sm"
                    isDisabled={isDisabled}
                  />
                </div>
              </div>

              {/* Error/Success Modal Message */}
              {messages.modal && (
                <div className={`p-3 text-xs rounded border ${
                  messages.modal.toLowerCase().includes('error') 
                    ? 'text-red-700 bg-red-50 border-red-200' 
                    : 'text-green-700 bg-green-50 border-green-200'
                }`}>
                  {messages.modal}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded text-sm font-bold text-white shadow-sm transition-all ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : (formData.id ? "UPDATE" : "SAVE")}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </Draggable>
  );
};

export default RepositoryModal;