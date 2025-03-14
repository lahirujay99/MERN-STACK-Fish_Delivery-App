// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth(); // Get setUser from AuthContext to update user after profile update
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "", // For new password input (optional)
    confirmPassword: "", // For confirm new password
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [updateError, setUpdateError] = useState({}); // For form-specific errors


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await instance.get("/auth/profile");
        setProfileData({
          username: response.data.username,
          email: response.data.email,
          password: "", // Clear password fields on load
          confirmPassword: "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      navigate('/signin'); // Redirect to signin if not logged in
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setUpdateError(prevErrors => ({ ...prevErrors, [name]: "" })); // Clear error for this input on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setUpdateError({}); // Reset form errors on submit

    // Basic password confirmation check on frontend
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setUpdateError({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }


    try {
      const updatePayload = {
        username: profileData.username,
        email: profileData.email,
      };
      if (profileData.password) { // Only send password if it's being updated
        updatePayload.password = profileData.password;
      }

      const response = await instance.put("/auth/profile", updatePayload);
      setSuccessMessage(response.data.message || "Profile updated successfully!");
      setError("");

      // Update user context with new user details from the backend after successful update
      setUser(response.data); // Assuming backend returns updated user object

      // Clear password fields after successful update
      setProfileData(prevState => ({
        ...prevState,
        password: "",
        confirmPassword: "",
      }));

    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
      if (err.response?.data?.errors) { // If backend sends specific validation errors, display them
        const backendValidationErrors = {};
        for (const errorKey in err.response.data.errors) {
          backendValidationErrors[errorKey] = err.response.data.errors[errorKey].message;
        }
        setUpdateError(backendValidationErrors); // Set form-specific errors from backend
      }

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true); // Show confirmation message first time button is clicked
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await instance.delete("/auth/profile");
      logout(); // Clear user session and token from frontend
      navigate("/", { replace: true }); // Redirect to homepage after deletion
    } catch (err) {
      console.error("Account deletion error:", err);
      setError(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
      setDeleteConfirmation(false); // Reset confirmation state
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user) { // Should not reach here due to useEffect redirect, but for safety
    return <ErrorMessage message="Please sign in to view your profile." />;
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Profile</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {updateError.username && <p className="mt-1 text-red-500 text-sm">{updateError.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {updateError.email && <p className="mt-1 text-red-500 text-sm">{updateError.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={profileData.password}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={profileData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {updateError.confirmPassword && <p className="mt-1 text-red-500 text-sm">{updateError.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Save Changes
        </button>
      </form>


      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Deletion</h2>
        {!deleteConfirmation ? (
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Delete Profile
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-red-700">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default ProfilePage;