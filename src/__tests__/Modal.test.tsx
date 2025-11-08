import { render, screen } from "@testing-library/react";
import {Modal} from "../components/ui/Modal";

describe("Modal", () => {
  
  test("muestra el contenido cuando isOpen = true", () => {
    render(<Modal isOpen={true} onClose={() => {}}>Contenido</Modal>);
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  test("no renderiza nada cuando isOpen = false", () => {
    render(<Modal isOpen={false} onClose={() => {}}>Oculto</Modal>);
    expect(screen.queryByText("Oculto")).not.toBeInTheDocument();
  });
});
