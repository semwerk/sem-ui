import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <label htmlFor="name-input" style={{
        display: 'block',
        marginBottom: 'var(--space-2)',
        fontSize: 'var(--font-size-2)',
        fontWeight: 'var(--font-weight-medium)',
      }}>
        Name
      </label>
      <Input id="name-input" placeholder="John Doe" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <label htmlFor="email-input" style={{
        display: 'block',
        marginBottom: 'var(--space-2)',
        fontSize: 'var(--font-size-2)',
        fontWeight: 'var(--font-weight-medium)',
      }}>
        Email
      </label>
      <Input
        id="email-input"
        type="email"
        placeholder="email@example.com"
        style={{ borderColor: 'var(--color-semantic-error)' }}
      />
      <div style={{
        marginTop: 'var(--space-2)',
        fontSize: 'var(--font-size-2)',
        color: 'var(--color-semantic-error)',
      }}>
        Please enter a valid email address
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '300px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="email@example.com" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="123" />
      <Input type="search" placeholder="Search..." />
    </div>
  ),
};
