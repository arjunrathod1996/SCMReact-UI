import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean; // optional for better UX
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this record?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
        
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;