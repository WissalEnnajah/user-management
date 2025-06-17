import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import  { useEffect } from "react";



const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance.get('/user/me')
      .then((res) => {
        console.log('Utilisateur :', res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue dans le Dashboard 🛠️</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;
