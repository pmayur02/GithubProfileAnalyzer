import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(()=>{},[])

  const fetchProfile = async () => {
    if (!username) {
      setError("Please enter a GitHub username.");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const fullUrl = `${BackendURL}/fetch-git-profile/${username}`;
      console.log(`fullUrl ${fullUrl}`);
      
      const res = await axios.post(fullUrl);
       debugger 
      if (!res.data?.data || res.data.data.length === 0) {
        setError("User not found.");
        setProfile(null);
      } else {
        setProfile(res.data.data);
        setError(null);
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        setError("User not found.");
      } else {
        setError(error.response?.data?.message || "Something went wrong.");
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Search Section */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          GitHub Profile Search
        </h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            View All Users
          </button>
        </div>
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

      {/* Profile Details */}
      {profile && (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar_url}
              alt={profile.login || profile.username}
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name || profile.login || profile.username}
              </h2>
              <p className="text-gray-600">
                @{profile.login || profile.username}
              </p>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Profile
              </a>
            </div>
          </div>
          <div className="mt-4 text-gray-700">
            <p>📍 {profile.location || "Location not available"}</p>
            <p>👥 Followers: {profile.followers}</p>
            <p>🔗 Following: {profile.following}</p>
            <p>📦 Public Repos: {profile.public_repos}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
