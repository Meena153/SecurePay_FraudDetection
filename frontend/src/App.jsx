import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import SplashScreen from "./components/SplashScreen";
import { authAPI } from "./api";

function App() {
  // Load user session from localStorage on startup
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loginTimestamp, setLoginTimestamp] = useState(() => {
    return localStorage.getItem("loginTimestamp") || null;
  });

  const [showSplash, setShowSplash] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    const timestamp = Date.now();
    setLoginTimestamp(timestamp);
    
    // Persist to storage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTimestamp", timestamp.toString());
  };

  const handleLogout = async () => {
    if (user && user.username) {
        try {
            await authAPI.logout({ username: user.username });
        } catch (err) {
            console.error("Logout API failed:", err);
        }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    setUser(null);
    setLoginTimestamp(null);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return isSignup ? (
      <Signup onSuccess={handleLogin} onToggle={() => setIsSignup(false)} />
    ) : (
      <Login onSuccess={handleLogin} onToggle={() => setIsSignup(true)} />
    );
  }

  return <Dashboard user={user} loginTimestamp={loginTimestamp} onLogout={handleLogout} />;
}

export default App;