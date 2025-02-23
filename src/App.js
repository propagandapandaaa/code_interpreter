import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';  // Import useAuth instead of AuthContext
import Navbar from './components/elements/Navbar';
import Coding from './components/tabs/Coding';
import Landing from './components/tabs/Landing';
import Signup from './components/tabs/Signup';
import Login from './components/tabs/Login';
import CodeEditor from './components/tabs/CodeEditor';
import Challenges from './components/tabs/Challenges';
import './App.css';
import Profile from './components/tabs/Profile';
import HomePage from './components/tabs/HomePage';

// Separate component for the authenticated content
function AppContent() {
  const { user } = useAuth();  // Use the custom hook instead of useContext

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/editor/:challengeId" element={<Coding />} />
        <Route path="/codeeditor" element={<CodeEditor />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/challenges" element={<Challenges />} />
      </Routes>
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
