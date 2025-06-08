import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogsPage from "./pages/LogsPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/logs" element={<LogsPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
