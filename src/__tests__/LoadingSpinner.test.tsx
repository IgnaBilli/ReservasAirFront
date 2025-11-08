import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner component', () => {
  test('renderiza con tamaño por defecto', () => {
    render(<LoadingSpinner />);
    const el = screen.getByLabelText('Loading');
    expect(el).toBeTruthy(); //el element existe
    expect(el.className).toContain('animate-spin'); //contiene clase animate
    // tamaño por defecto es md
    expect(el.className).toContain('h-8');
    expect(el.className).toContain('w-8');
  });

  test('aplica clases para tamaños sm y lg', () => { //que funcione en sm y lg
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let el = screen.getByLabelText('Loading');
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-4');

    rerender(<LoadingSpinner size="lg" />);
    el = screen.getByLabelText('Loading');
    expect(el.className).toContain('h-12');
    expect(el.className).toContain('w-12');
  });

  test('aplica className personalizado', () => {
    render(<LoadingSpinner className="my-custom-class" />);
    const el = screen.getByLabelText('Loading');
    expect(el.className).toContain('my-custom-class');
  });
});
