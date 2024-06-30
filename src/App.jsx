import React, { useContext, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Error from './pages/Error';
import { AuthContext } from './context/AuthContext';
import { FallingLines } from 'react-loader-spinner'

function App() {
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); 
    };

    checkAuthStatus();
  }, []); 

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
      <div className='h-full flex justify-center items-center' style={{backgroundColor: '#020F1C'}}>
         <FallingLines
                color="#eeeeee"
                width="100"
                visible={true}
                ariaLabel="falling-circles-loading"
          />
      </div>
      )
    }

    if (!currentUser) {
      return <Navigate to="/register" />;
    }

    return children;
  }

  const PublicRoute = ({ children })=>{

    if(currentUser){
      return <Navigate to='/'/>
    }

    return children
  }

  return (
    <div className="h-screen w-full">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
