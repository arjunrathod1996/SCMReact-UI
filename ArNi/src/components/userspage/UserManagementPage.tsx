import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import { User } from '../../store';

/** --- 1. Interface for API Response --- **/
interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  ourUsersList: User[];
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Type the response as GetAllUsersResponse to access ourUsersList
      const response: GetAllUsersResponse = await UserService.getAllUsers(token);
      setUsers(response.ourUsersList || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string | number | undefined) => {
    if (!userId) return;

    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this user?');
      const token = localStorage.getItem('token');

      if (confirmDelete && token) {
        await UserService.deleteUser(userId.toString(), token);
        // Refresh the list after successful deletion
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-6 sm:ml-64 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase">Users Management</h2>
        <Link 
          to="/register" 
          className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition shadow-md"
        >
          + ADD USER
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-lg font-semibold">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{user.id}</td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-3">
                      <Link 
                        to={`/update-user/${user.id}`}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition font-bold"
                      >
                        Update
                      </Link>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;