import axios from 'axios';
import type { RegistrationResponse } from './index';

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
if (!REMOTE_SERVER) {
  throw new Error('REMOTE_SERVER is not defined');
}

export const ADMIN_API = `${REMOTE_SERVER}/users`;

export const registerUser = async (data: {
  email: string;
  role: string;
}): Promise<RegistrationResponse> => {
  try {
    const response = await axios.post(ADMIN_API, data);
    
    return {
      success: true,
      message: 'User registered successfully!',
      userId: response.data.userID || response.data.id
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.response) {
      const statusCode = error.response.status;
      
      // Handle specific status codes
      switch (statusCode) {
        case 409: // Conflict - email already exists
          return {
            success: false,
            message: 'This email address is already registered. Please use a different email or contact support if this is your account.'
          };
        case 400: // Bad request
          return {
            success: false,
            message: 'Invalid information provided. Please check your email and role selection.'
          };
        case 500: // Server error
          return {
            success: false,
            message: 'Server error occurred. Please try again later or contact support.'
          };
        default:
          return {
            success: false,
            message: error.response.data?.message || 'Registration failed. Please try again.'
          };
      }
    }
    
    // Network or other errors
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.'
    };
  }
};

export const getUser = async (userId: string) => {
  const response = await axios.get(ADMIN_API, 
    {
      params: { userID: userId } 
    }
  );
  return response.data;
};