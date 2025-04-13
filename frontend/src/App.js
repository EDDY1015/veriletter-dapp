import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Verify from "./pages/Verify";
import Issue from "./pages/Issue";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import IssuerDashboard from "./pages/IssuerDashboard";


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
<Route path="*" element={<Navigate to="/" replace />} />
<Route path="/dashboard" element={user ? <IssuerDashboard user={user} /> : <Navigate to="/login" replace />} />
</Routes>
<Footer/>
    </Router>
  );
}

export default App;
