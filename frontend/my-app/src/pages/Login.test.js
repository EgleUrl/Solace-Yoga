// integration testing of the login page using npm test Login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';


// Mock toast and axios
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../api/axios', () => ({
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
}));

//  Mock Google login
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => jest.fn(),
}));

const renderLogin = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

describe('Login Page', () => {
  it('renders form inputs and buttons', () => {
    renderLogin();
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('updates input fields', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/username or email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('submits the form and redirects after login', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        access: 'fake-token',
        user: { username: 'testuser', email: 'test@example.com', role: 'client' },
      },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/sign in with google/i)).toBeInTheDocument();
  });

  it('shows error message when login fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid login'));

    renderLogin();
    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await new Promise((resolve) => setTimeout(resolve, 100)); // Allow async to resolve

    expect(toast.error).toHaveBeenCalledWith('Invalid username or password');
  });
});

