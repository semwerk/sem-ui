import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    let clicked = false;

    render(<Button onClick={() => (clicked = true)}>Click me</Button>);

    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(clicked).toBe(true);
  });
});
