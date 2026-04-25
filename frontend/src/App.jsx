import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import SplashScreen from "./components/SplashScreen";
import { authAPI } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loginTimestamp, setLoginTimestamp] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoginTimestamp(Date.now());
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
    setUser(null);
    setLoginTimestamp(null);
  };

  // Handle browser close / refresh to log user out
  useEffect(() => {
      const handleUnload = () => {
          if (user && user.username) {
              const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/api/auth/logout`;
              // sendBeacon ensures the request goes out even as the page unloads
              const blob = new Blob([JSON.stringify({ username: user.username })], { type: 'application/json' });
              navigator.sendBeacon(url, blob);
          }
      };

      window.addEventListener('beforeunload', handleUnload);
      return () => {
          window.removeEventListener('beforeunload', handleUnload);
      };
  }, [user]);

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