// This file contains functions to handle user authentication
// and registration using the API. It includes functions to register a new user
// and login an existing user. The functions make HTTP POST requests to the
// appropriate endpoints and return the response data.
import api from './axios';

// Register new user
export const registerUser = async (username, email, password, role) => {
  const response = await api.post('register/', {
    username,
    email,
    password,
    role, 
  });
  return response.data;
};

// Login user
export const loginUser = async (username, password) => {
  const response = await api.post('token/', {
    username,
    password,
  });
  return response.data; // contains access and refresh tokens
};
