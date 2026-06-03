import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes';
import { AuthProvider } from './contexts/AuthContext';
import ToastProvider from './components/ui/ToastProvider';
import './index.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
