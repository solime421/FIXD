import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateLayout from './components/PrivateLayout';
import Login from './_auth/Login.jsx';
import Register from './_auth/Register.jsx'
import PrivateRoute from './_auth/PrivateRoute.jsx';
import Home from './pages/Home.jsx'; 


const App = () => {
  return (
    <main>
      <Routes>
        {/*public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    
        {/*private routes */}
        <Route element={ <PrivateRoute> <PrivateLayout /> </PrivateRoute>}>
            <Route path="/home" element={<Home />} />
            {/* add more private routes here */}

        </Route>
        
        {/* Fallback for any unknown URL */}
        <Route path="*" element={<p>404: Page not found</p>} />
      </Routes>
    </main>
  );
};

export default App;
