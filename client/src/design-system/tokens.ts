export const tokens = {
  color: {
    brand: { 50: 'var(--plu-yellow-50)', 500: 'var(--plu-yellow-500)', 600: 'var(--plu-yellow-600)', 900: 'var(--plu-yellow-900)' },
    status: { success: 'var(--status-success)', warning: 'var(--status-warning)', danger: 'var(--status-danger)', info: 'var(--status-info)', neutral: 'var(--status-neutral)' },
    surface: { base: 'var(--surface-base)', raised: 'var(--surface-raised)', sunken: 'var(--surface-sunken)' },
    text: { primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', inverse: 'var(--text-inverse)' },
    border: { subtle: 'var(--border-subtle)', strong: 'var(--border-strong)' },
  },
  focus: { color: 'var(--focus-ring-color)', width: 'var(--focus-ring-width)', offset: 'var(--focus-ring-offset)' },
  touch: { min: 'var(--touch-min)', comfortable: 'var(--touch-comfortable)' },
  space: { 1: 'var(--space-1)', 2: 'var(--space-2)', 3: 'var(--space-3)', 4: 'var(--space-4)', 6: 'var(--space-6)', 8: 'var(--space-8)' },
  radius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', pill: 'var(--radius-pill)' },
} as const;
