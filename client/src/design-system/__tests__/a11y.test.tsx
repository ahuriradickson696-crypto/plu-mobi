import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button, StatusChip, KPIWidget, FormField } from '../components';

describe('design-system accessibility (WCAG 2.2 AA)', () => {
  it('Button has no axe violations', async () => {
    const { container } = render(<Button>Sign In</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Button (loading) exposes aria-busy', async () => {
    const { container, getByRole } = render(<Button loading>Submitting</Button>);
    expect(getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('StatusChip uses text + icon, never colour alone', async () => {
    const { container, getByText } = render(<StatusChip status="approved" />);
    expect(getByText('Approved')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('KPIWidget announces live value', async () => {
    const { container, getByRole } = render(<KPIWidget label="Members" value="96,207" />);
    const status = getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('FormField binds label + error to input', async () => {
    const { container, getByLabelText } = render(
      <FormField label="Phone" error="Required" />,
    );
    const input = getByLabelText('Phone');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });
});
