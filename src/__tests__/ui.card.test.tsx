import { render } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card component', () => {
  test('renderiza children y padding', () => {
    const { getByText } = render(<Card>Hola</Card>);
    expect(getByText('Hola')).toBeTruthy();
  });

  test('aplica custom className', () => {
    const { container } = render(<Card className="custom" padding="lg">Content</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.className).toContain('p-8');
  });
});
