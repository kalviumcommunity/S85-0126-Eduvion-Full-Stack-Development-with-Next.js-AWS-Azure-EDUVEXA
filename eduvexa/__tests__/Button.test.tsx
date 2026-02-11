import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../src/components/ui/Button';

// Mock the cn utility function since it's not defined
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('Button Component', () => {
  it('renders button with label', () => {
    render(<Button label="Click Me" />);
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: 'Click Me' });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button label="Primary" variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');
    
    rerender(<Button label="Secondary" variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-white');
    
    rerender(<Button label="Danger" variant="danger" />);
    expect(screen.getByRole('button')).toHaveClass('bg-error-600');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button label="Small" size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');
    
    rerender(<Button label="Medium" size="md" />);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2');
    
    rerender(<Button label="Large" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('shows loading spinner when loading', () => {
    render(<Button label="Loading" loading />);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button label="With Icon" icon={icon} />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders as link when href is provided', () => {
    render(<Button label="Link" href="https://example.com" />);
    const link = screen.getByRole('link');
    
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button label="Full Width" fullWidth />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('w-full');
  });

  it('has correct button type', () => {
    render(<Button label="Submit" type="submit" />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('type', 'submit');
  });
});
