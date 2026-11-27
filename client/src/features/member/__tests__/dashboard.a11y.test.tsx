import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import Dashboard from '../Dashboard';

vi.mock('../../../store/auth', () => ({
  useAuth: () => ({
    member: { fullName: 'Test Member', pcNumber: 'PC-000001', status: 'tentative' },
  }),
}));

describe('Member Dashboard accessibility (WCAG 2.2 AA)', () => {
  it('has no axe violations with a signed-in member', async () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in signed-out state', async () => {
    vi.resetModules();
    vi.doMock('../../../store/auth', () => ({ useAuth: () => ({ member: null }) }));
    const { default: DashboardLoggedOut } = await import('../Dashboard');
    const { container } = render(
      <MemoryRouter>
        <DashboardLoggedOut />
      </MemoryRouter>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
