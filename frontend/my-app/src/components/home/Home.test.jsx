// Home page components unit testiing
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BigImage from './BigImage';
import WelcomeSection from './WelcomeSection';
import FeaturedClasses from './FeaturedClasses';
import Testimonials from './Testimonials';
import NewsletterSignup from './NewsletterSignup';

// Mock assets (like hero image)
vi.mock('../assets/hero-image.png', () => 'hero-image.png');

const withRouter = (Component) => (
  <BrowserRouter>
    <Component />
  </BrowserRouter>
);

describe('Home Section Components', () => {
  it('renders BigImage with heading and button', () => {
    render(withRouter(BigImage));
    expect(screen.getByText(/welcome to solace yoga/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /see classes/i })).toBeInTheDocument();
  });

  it('renders WelcomeSection with explore button', () => {
    render(withRouter(WelcomeSection));
    expect(screen.getByText(/solace yoga studio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore our studio/i })).toBeInTheDocument();
  });

  it('renders FeaturedClasses with all class cards', () => {
    render(withRouter(FeaturedClasses));
    expect(screen.getByText(/our classes/i)).toBeInTheDocument();
    expect(screen.getByText(/sunrise flow/i)).toBeInTheDocument();
    expect(screen.getByText(/balance & restore/i)).toBeInTheDocument();
    expect(screen.getByText(/evening calm/i)).toBeInTheDocument();
  });

  it('renders Testimonials with quotes', () => {
    render(withRouter(Testimonials));
    expect(screen.getByText(/what our clients say/i)).toBeInTheDocument();
    expect(screen.getByText(/Solace Yoga has transformed my mornings!/i)).toBeInTheDocument();
    expect(screen.getByText(/The teachers are fantastic/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfect place to find balance/i)).toBeInTheDocument();
  });

  it('renders NewsletterSignup and handles form interaction', () => {
    render(withRouter(NewsletterSignup));
    expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/your email/i);
    const button = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(input, { target: { value: 'invalidemail' } });
    fireEvent.click(button);

    expect(screen.getByText(/please, enter a valid email/i)).toBeInTheDocument();
  });
});
