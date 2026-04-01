import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Draggable from 'react-draggable';
import { FaTimes } from "react-icons/fa";
import Select, { SingleValue } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from "react-modal";
import BusinessService from '../service/BusinessService';
import MerchantService from '../service/MerchantService';
import RoleService from '../service/RoleService';

/** --- 1. Interfaces --- **/

interface SelectOption {
  value: string | number;
  label: string;
}

interface RoleFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleSubmit: (data: any) => void;
}

interface FormErrors {
  business?: string;
  merchant?: string;
  role?: string;
  validityDate?: string;
  email?: string;
  password?: string;
}

/** --- 2. Helper Component --- **/

interface NoOptionsProps {
  inputValue: string;
  filteredOptions: SelectOption[];
}

const NoOptionsMessage: React.FC<NoOptionsProps> = ({ inputValue, filteredOptions }) => {
  if (inputValue.length < 3) {
    return <div className="p-1 text-gray-500 text-sm">Enter 3 characters to search</div>;
  }
  if (filteredOptions.length === 0) {
    return <div className="p-1 text-gray-500 text-sm">Data not found</div>;
  }
  return null;
};

/** --- 3. Main Component --- **/

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, closeModal, handleSubmit }) => {
  // Selection States
  const [selectedBusiness, setSelectedBusiness] = useState<SelectOption | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<SelectOption | null>(null);
  const [selectedRole, setSelectedRole] = useState<SelectOption | null>(null);
  const [validityDate, setValidityDate] = useState<Date | null>(null);
  
  // Input States
  const [email, setUserEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Options States
  const [businessOptions, setBusinessOptions] = useState<SelectOption[]>([]);
  const [merchantOptions, setMerchantOptions] = useState<SelectOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([]);
  
  // Filtering States
  const [filteredBusinessOptions, setFilteredBusinessOptions] = useState<SelectOption[]>([]);
  const [filteredMerchantOptions, setFilteredMerchantOptions] = useState<SelectOption[]>([]);
  const [businessInputValue, setBusinessInputValue] = useState<string>('');
  const [merchantInputValue, setMerchantInputValue] = useState<string>('');
  
  const [errors, setErrors] = useState<FormErrors>({});

  /** --- 4. Fetch Data Effects --- **/

  useEffect(() => {
    const fetchBusinessOptions = async () => {
      try {
        const businesses = await BusinessService.searchBusiness('');
        const options = businesses.map((b: any) => ({ value: b.id, label: b.name }));
        setBusinessOptions(options);
        setFilteredBusinessOptions(options);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinessOptions();
  }, []);

  useEffect(() => {
    const fetchMerchantOptions = async () => {
      try {
        const merchants = await MerchantService.searchMerchant('');
        const options = merchants.map((m: any) => ({ value: m.id, label: m.name }));
        setMerchantOptions(options);
        setFilteredMerchantOptions(options);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    fetchMerchantOptions();
  }, []);

  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const roles = await RoleService.getRoles();
        const options = roles.map((r: any) => ({ value: r.name, label: r.tag }));
        setRoleOptions(options);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoleOptions();
  }, []);

  /** --- 5. Filtering Effects --- **/

  useEffect(() => {
    if (businessInputValue.length >= 3) {
      const results = businessOptions.filter(opt =>
        opt.label.toLowerCase().startsWith(businessInputValue.toLowerCase())
      );
      setFilteredBusinessOptions(results);
    } else {
      setFilteredBusinessOptions([]);
    }
  }, [businessInputValue, businessOptions]);

  useEffect(() => {
    if (merchantInputValue.length >= 3) {
      const results = merchantOptions.filter(opt =>
        opt.label.toLowerCase().startsWith(merchantInputValue.toLowerCase())
      );
      setFilteredMerchantOptions(results);
    } else {
      setFilteredMerchantOptions([]);
    }
  }, [merchantInputValue, merchantOptions]);

  /** --- 6. Handlers & Validation --- **/

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!selectedBusiness) newErrors.business = "Business is required";
    if (!selectedMerchant) newErrors.merchant = "Merchant is required";
    if (!selectedRole) newErrors.role = "Role is required";
    if (!validityDate) newErrors.validityDate = "Validity Date is required";
    if (!password) newErrors.password = "Password is required";
    if (!email) newErrors.email = "Email is required";
    return newErrors;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      handleSubmit({
        business: selectedBusiness,
        merchant: selectedMerchant,
        roleName: selectedRole?.value || null,
        validityDate,
        password,
        email
      });
    }
  };

  const handleBusinessChange = (option: SingleValue<SelectOption>) => {
    setSelectedBusiness(option);
    if (option) setErrors(prev => ({ ...prev, business: undefined }));
  };

  const handleMerchantChange = (option: SingleValue<SelectOption>) => {
    setSelectedMerchant(option);
    if (option) setErrors(prev => ({ ...prev, merchant: undefined }));
  };

  const handleRoleChange = (option: SingleValue<SelectOption>) => {
    setSelectedRole(option);
    if (option) setErrors(prev => ({ ...prev, role: undefined }));
  };

  return (
    <Draggable handle=".drag-handle">
      <div className="z-50">
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          contentLabel="Role Form Modal"
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
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Role Assignment</h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              
              {/* Business Select */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Business</label>
                <Select
                  options={filteredBusinessOptions}
                  value={selectedBusiness}
                  onChange={handleBusinessChange}
                  onInputChange={(val) => setBusinessInputValue(val)}
                  placeholder="Search Business..."
                  className="text-sm"
                  noOptionsMessage={() => (
                    <NoOptionsMessage inputValue={businessInputValue} filteredOptions={filteredBusinessOptions} />
                  )}
                />
                {errors.business && <span className="text-red-500 text-xs mt-1 font-medium">{errors.business}</span>}
              </div>

              {/* Merchant Select */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Merchant</label>
                <Select
                  options={filteredMerchantOptions}
                  value={selectedMerchant}
                  onChange={handleMerchantChange}
                  onInputChange={(val) => setMerchantInputValue(val)}
                  placeholder="Search Merchant..."
                  className="text-sm"
                  noOptionsMessage={() => (
                    <NoOptionsMessage inputValue={merchantInputValue} filteredOptions={filteredMerchantOptions} />
                  )}
                />
                {errors.merchant && <span className="text-red-500 text-xs mt-1 font-medium">{errors.merchant}</span>}
              </div>

              {/* Role Select */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
                <Select
                  options={roleOptions}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  placeholder="Select Role"
                  className="text-sm"
                />
                {errors.role && <span className="text-red-500 text-xs mt-1 font-medium">{errors.role}</span>}
              </div>

              {/* Validity Date */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Validity Date</label>
                <DatePicker
                  selected={validityDate}
                  onChange={(date: Date | null) => setValidityDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Click to select date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.validityDate && <span className="text-red-500 text-xs mt-1 font-medium">{errors.validityDate}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 font-medium">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1 font-medium">{errors.password}</span>}
              </div>
            </div>

            {/* Submit Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-all shadow-sm active:scale-95"
              >
                SUBMIT ROLE
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Draggable>
  );
};

export default RoleFormModal;