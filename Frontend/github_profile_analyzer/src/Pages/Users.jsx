import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // backend default
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all users with pagination
  const fetchAllUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BackendURL}/apis/fetch-profiles`, {
        params: { page: pageNum, pageSize }
      });
      const data = res.data;

      if (!data.data?.profiles || data.data.profiles.length === 0) {
        setError("No profiles found.");
        setUsers([]);
      } else {
        setUsers(data.data.profiles);
        setPagination(data.data.pagination || { totalPages: 1, total: 0 });
        setError(null);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("No profiles found.");
        setUsers([]);
      } else {
        setError(error.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch single user
  const fetchUser = async () => {
    if (!search) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BackendURL}/apis/fetch-profile/${search}`);
      if (!res.data?.data || res.data.data.length === 0) {
        setError("User not found.");
        setSearchedUser(null);
      } else {
        setSearchedUser(res.data.data[0]);
        setError(null);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("User not found.");
      } else {
        setError(error.response?.data?.message || "Something went wrong.");
      }
      setSearchedUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (username) => {
    try {
      setLoading(true);
      await axios.delete(`${BackendURL}/apis/delete-git-profile/${username}`);
      fetchAllUsers(page); // refresh current page
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("User not found or already deleted.");
      } else {
        setError(error.response?.data?.message || "Failed to delete user.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">All GitHub Users</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 space-x-2">
        <input
          type="text"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 rounded-lg p-4 mb-6 max-w-md mx-auto">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mb-6">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Searched User */}
      {searchedUser && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold">
            {searchedUser.name || searchedUser.username}
          </h2>
          <p className="text-gray-600">@{searchedUser.username}</p>
          <a
            href={searchedUser.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Profile
          </a>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="border-b">
                <td className="py-2 px-4">@{user.username}</td>
                <td className="py-2 px-4">{user.name || "N/A"}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => deleteUser(user.username)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !error && (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${
            page <= 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${
            page >= pagination.totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
