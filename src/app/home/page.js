"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CrudTableWithHeader() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Manage users as state
  const [userData, setUserData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "User" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  // Handle user input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for adding a new user
  const openAddModal = () => {
    setIsEditing(false);
    setNewUser({ name: "", email: "", role: "" });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setNewUser(user);
    setIsModalOpen(true);
  };

  // Add a new user
  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setUserData([...userData, { ...newUser, id: Date.now() }]);
      setIsModalOpen(false);
    }
  };

  // Save edited user
  const handleSaveUser = () => {
    setUserData(
      userData.map((user) =>
        user.id === currentUser.id ? { ...currentUser, ...newUser } : user
      )
    );
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentUser(null);
  };

  // Delete a user
  const handleDeleteUser = (userId) => {
    setUserData(userData.filter((user) => user.id !== userId));
  };

  // Logout
  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={30}
              priority
            />
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span className="font-medium">Action</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Settings
                </a>
                <a
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white"
                  onClick={handleSignOut}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="flex flex-col items-center p-8">
        <h2 className="text-2xl font-semibold mb-8">User Management</h2>
        <button
          onClick={openAddModal}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New User
        </button>

        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.role}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit User" : "Add User"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              className="px-3 py-2 mb-2 rounded border w-full bg-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className="px-3 py-2 mb-2 rounded border w-full bg-transparent"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newUser.role}
              onChange={handleInputChange}
              className="px-3 py-2 mb-4 rounded border w-full bg-transparent"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              {isEditing ? (
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
