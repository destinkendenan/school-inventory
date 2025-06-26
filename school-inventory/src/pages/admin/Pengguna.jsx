import React, { useState, useEffect } from "react";
import { getUsers } from "../../services/apiService";
import "../../index.css";
import "./Pengguna.css"; // Assuming you have some styles for this component

const Pengguna = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        
        // Debug logs
        console.log("Raw API data:", data);
        
        // Filter out admin users - handle different possible formats
        const regularUsers = data.filter(user => {
          // Debug log untuk setiap user
          console.log("User:", user);
          
          // Check various ways role might be stored
          const userRole = user.role || user.user_role || user.userRole || '';
          const isAdmin = 
            typeof userRole === 'string' && 
            (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "administrator");
          
          console.log(`User ${user.username || user.name || user.id} - Role: ${userRole}, isAdmin: ${isAdmin}`);
          
          return !isAdmin;
        });
        
        console.log("Filtered users (non-admin):", regularUsers);
        setUsers(regularUsers);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Gagal memuat data pengguna: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="pengguna-admin-wrapper">
      <div className="pengguna-admin-container-full">
        <div className="pengguna-admin-header">
          <h2 className="pengguna-admin-title pengguna-admin-title-blue">
            Data Pengguna
          </h2>
        </div>
        <div className="pengguna-admin-card">
          <div className="pengguna-admin-card-header">
            <span className="pengguna-admin-card-title">Daftar Pengguna</span>
            <span className="pengguna-admin-card-count">
              Total: {users.length} pengguna
            </span>
          </div>
          <div className="pengguna-admin-table-wrapper">
            <table className="pengguna-admin-table pengguna-admin-table-blue">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Pengguna</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Memuat data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Tidak ada data pengguna
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user.id || idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td>{user.username || user.name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengguna;