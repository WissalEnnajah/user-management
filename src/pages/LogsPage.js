import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDownload } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

const formatDateFr = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8083/api/logs", {
        auth: { username: "admin", password: "admin123" },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === "" || log.action === actionFilter;
    const matchesDate =
      dateFilter === "" ||
      new Date(log.timestamp).toISOString().slice(0, 10) === dateFilter;

    return matchesSearch && matchesAction && matchesDate;
  });

  const exportCSV = () => {
    const csvRows = [
      ["ID", "Utilisateur", "Action", "Date"],
      ...filteredLogs.map((log) => [
        log.id,
        log.userEmail,
        log.action,
        formatDateFr(log.timestamp),
      ]),
    ];

    const blob = new Blob([csvRows.map((row) => row.join(",")).join("\n")], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionStyle = (action) => {
    if (action.includes("Connexion")) return "text-green-600 font-medium";
    if (action.includes("supprimé") || action.includes("erreur"))
      return "text-red-600 font-medium";
    return "text-blue-600";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Historique des Logs</h1>

      <div className="flex gap-4 mb-4 items-center">
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border rounded-xl w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={exportCSV}
          className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-600"
        >
          <MdDownload />
          Exporter CSV
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          {/* 🔽 Filtrer par type d’action */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            <option value="">Toutes les actions</option>
            {/* Remplace ou ajoute les actions selon ton backend */}
            <option value="Connexion réussie">Connexion réussie</option>
            <option value="Création d'utilisateur">
              Création d'utilisateur
            </option>
            <option value="Suppression d'utilisateur">
              Suppression d'utilisateur
            </option>
            <option value="Erreur d'authentification">
              Erreur d'authentification
            </option>
          </select>

          {/* 🗓️ Filtrer par date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          />

          {/* ❌ Bouton pour réinitialiser les filtres */}
          {(actionFilter || dateFilter) && (
            <button
              onClick={() => {
                setActionFilter("");
                setDateFilter("");
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded-xl hover:bg-gray-400"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Utilisateur</th>
              <th className="text-left px-6 py-3">Action</th>
              <th className="text-left px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Aucun log trouvé
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{log.id}</td>
                  <td className="px-6 py-4">{log.userEmail}</td>
                  <td className={`px-6 py-4 ${getActionStyle(log.action)}`}>
                    {log.action}
                  </td>
                  <td className="px-6 py-4">{formatDateFr(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsPage;
