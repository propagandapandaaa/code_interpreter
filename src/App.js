//import logo from './logo.svg';
import React from 'react';
import Navbar from './components/Navbar';
import CodeEditor from './components/pages/CodeEditor';
import Home from './components/pages/Home';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/pages/LandingPage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Home />} />
          <Route path='/editor' element={<CodeEditor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
