import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Card Title</h3>
        <p style={{ margin: 0, color: '#6c757d' }}>
          This is a basic card component with default styling.
        </p>
      </div>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    style: { padding: 'var(--space-6)' },
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Padded Card</h3>
        <p style={{ margin: 0, color: '#6c757d' }}>
          Card with custom padding using spacing tokens.
        </p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    style: {
      cursor: 'pointer',
      transition: 'all var(--motion-duration-fast) var(--motion-easing-default)',
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.transform = 'translateY(0)';
    },
    children: (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Interactive Card</h3>
        <p style={{ margin: 0, color: '#6c757d' }}>
          Hover to see elevation change. Uses motion and shadow tokens.
        </p>
      </div>
    ),
  },
};
