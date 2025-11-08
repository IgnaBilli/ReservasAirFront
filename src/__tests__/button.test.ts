import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../components/ui/Button';



describe('Button component', () => {
  test('muestra el texto pasado como children', () => {
    render(Button({ children: 'Reservar' }));
    const boton = screen.getByText('Reservar');
    expect(boton).toBeInTheDocument();
  });

  test('llama a onClick al hacer click', () => {
    const handleClick = jest.fn();
    render(Button({ onClick: handleClick, children: 'Click' }));
    const boton = screen.getByText('Click');
    fireEvent.click(boton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('está deshabilitado si disabled es true', () => {
    render(Button({ disabled: true, children: 'Deshabilitado' }));
    const boton = screen.getByText('Deshabilitado');
    expect(boton).toBeDisabled();
  });

  test('está deshabilitado si loading es true', () => {
    render(Button({ loading: true, children: 'Cargando' }));
    const boton = screen.getByText('Cargando');
    expect(boton).toBeDisabled();
  });
});

