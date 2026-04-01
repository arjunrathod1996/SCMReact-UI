import React, { useState } from 'react';
import ActionButtons from '../common/ActionButtons';
import RoleFormModal from '../modal/RoleFormModal';
import MerchantService from '../service/MerchantService';
import MessageDisplay from '../common/MessageModalDisplay';
// 1. Import UserProfile to type the prop
import { User } from '../../store';

/** --- 1. Interfaces --- **/

// FIXED: Added Props interface to allow the 'user' prop from App.tsx
interface RolePageProps {
  user: User | null;
}

interface RoleFormData {
  id?: string | number;
  business: { value: string | number; label: string };
  merchant: { value: string | number; label: string };
  roleName: string;
  validityDate: Date | string;
  email: string;
  password?: string;
}

/** --- 2. Component --- **/

// FIXED: Passed RolePageProps to React.FC and destructured 'user'
const RolePage: React.FC<RolePageProps> = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleSubmit = async (formData: RoleFormData) => {
    try {
      if (formData.id) {
        console.log("Updating User ID:", formData.id);
      } else {
        console.log("Creating user for Merchant:", formData.merchant.value);
        await MerchantService.saveUser(
          formData as any, 
          null, 
          formData.business.value, 
          formData.merchant.value
        );
      }

      setMessage("Role data saved successfully!");
      setTimeout(() => {
        setMessage("");
        closeModal();
      }, 3000);

    } catch (error) {
      console.error("Error saving role data:", error);
      setMessage("Error saving role data. Please try again.");
    }
  };

  /** --- 3. Handlers --- **/

  const handleEdit = () => {
    setMessage("Please select a user to edit.");
  };

  const handleDelete = () => {
    setMessage("Please select a user to delete.");
  };

  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      <MessageDisplay 
        message={message} 
        type={message.toLowerCase().includes("success") ? "success" : "error"}
        clearMessage={() => setMessage("")}
      />

      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">
        Role Assignment
      </h1>

      {/* Example of using the user prop if needed */}
      {user && (
        <p className="text-xs text-gray-500 mb-2 italic">
          Logged in as: {user.name}
        </p>
      )}

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <ActionButtons 
          openModal={openModal} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      </div>

      <RoleFormModal 
        isOpen={modalIsOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default RolePage;