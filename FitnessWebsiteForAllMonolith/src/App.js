import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./utils/routerCheck"; // ensures react-router-dom is bundled
import "./App.css";
import "./styles/base.css";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ContentList, ContentDetail, Plans } from "./pages/Content";
import { CommunityHome, NewTopic, TopicDetail } from "./pages/Community";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Forbidden from "./pages/Forbidden";
import { AdminRoute, PrivateRoute } from "./components/ProtectedRoute";
import logo from "./logo.svg";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Navbar onToggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/community" element={<CommunityHome />} />
              <Route path="/community/new" element={<NewTopic />} />
              <Route path="/community/:id" element={<TopicDetail />} />
            </Route>
            <Route path="/content" element={<ContentList />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={
              <main className="container">
                <div className="card" style={{ padding: "1rem" }}>
                  <h1>404 - Not Found</h1>
                  <img src={logo} alt="" style={{ width: 80, height: 80 }} />
                  <p>Sorry, the page you are looking for does not exist.</p>
                </div>
              </main>
            } />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
