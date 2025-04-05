import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Verify from "./pages/Verify";
import Issue from "./pages/Issue";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setUser(stored);
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
      <Route path="/" element={<Home />} />
<Route path="/login" element={<Login setUser={setUser} />} />
<Route path="/verify" element={<Verify />} />
<Route path="/issue" element={user ? <Issue /> : <Navigate to="/login" replace />} />
<Route path="*" element={<Navigate to="/" replace />} /></Routes>
    </Router>
  );
}

export default App;
