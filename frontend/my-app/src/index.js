// React entry point for the application
// This file is the main entry point for the React application. It sets up the application with necessary providers and renders the main App component.
// It also includes styles and toast notifications for user feedback.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BasketProvider } from './context/BasketContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import './index.css';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="333287048432-s6shjv5f0o7o7oqgi6g8m3m096qej58j.apps.googleusercontent.com">
    <PayPalScriptProvider options={{ "client-id": "AQCWj0DdMEvWgqFxNNpzGVPv1A1pqDnPlmmmWVHuleU4uqkaT17Ow91JT2kkYcvy1Y8D-SmoYbSA93SG" }}>
      <AuthProvider>
        <BasketProvider>
          <App />
          <ToastContainer position="top-center" autoClose={3000} />
        </BasketProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  </GoogleOAuthProvider>
);

