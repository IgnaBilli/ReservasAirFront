import { render } from '@testing-library/react';
import { Chip } from '@/components/ui/Chip';

describe('Chip component', () => {
  test('renderiza variante default', () => {
    const { getByText } = render(<Chip>Label</Chip>);
    const el = getByText('Label');
    expect(el).toBeTruthy();
    expect(el.className).toContain('bg-gray-200');
    expect(el.className).toContain('px-3');
  });

  test('renderiza variante con small size', () => {
    const { getByText } = render(<Chip variant="success" size="sm">OK</Chip>);
    const el = getByText('OK');
    expect(el.className).toContain('bg-green-100');
    expect(el.className).toContain('text-xs');
  });
});
