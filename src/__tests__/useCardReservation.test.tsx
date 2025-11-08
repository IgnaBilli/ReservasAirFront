import { renderHook, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCardReservation } from "../components/CardReservation/useCardReservation";
import { Reservation } from "../interfaces";
import { ReactNode } from "react";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

// Mock reservation data
const mockReservation: Reservation = {
  reservationId: 1,
  externalUserId: 123,
  externalFlightId: 456,
  flightData: {
    flightNumber: "AR1234",
    origin: {
      code: "EZE",
      city: "Buenos Aires",
      time: "10:00",
    },
    destination: {
      code: "MDQ",
      city: "Mar del Plata",
      time: "12:00",
    },
    flightDate: "2025-12-25T10:00:00.000Z", // Future date
    aircraftModel: "Boeing 737",
  },
  seats: [
    {
      seatId: 1,
      seatNumber: "12A",
      cabinName: "economy",
      price: 100,
    },
    {
      seatId: 2,
      seatNumber: "12B",
      cabinName: "economy",
      price: 100,
    },
  ],
  totalPrice: 200,
  status: "PAID",
  createdAt: "2025-09-20T10:00:00.000Z",
  updatedAt: "2025-09-20T10:00:00.000Z",
};

const mockPastReservation: Reservation = {
  ...mockReservation,
  reservationId: 2,
  flightData: {
    ...mockReservation.flightData,
    flightDate: "2025-01-01T10:00:00.000Z", // Past date
  },
};

const mockPendingReservation: Reservation = {
  ...mockReservation,
  reservationId: 3,
  status: "PENDING",
};

const mockCancelledReservation: Reservation = {
  ...mockReservation,
  reservationId: 4,
  status: "CANCELLED",
};

describe("useCardReservation", () => {
  const mockOnCancelReservation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deberia iniciarse con los valores por default", () => {
    const { result } = renderHook(
      () =>
        useCardReservation({
          reservation: mockReservation,
          onCancelReservation: mockOnCancelReservation,
          isCancelling: false,
        }),
      { wrapper: TestWrapper }
    );

    expect(result.current.showCancelModal).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.seatNumbers).toBe("12A, 12B");
    expect(result.current.seatCount).toBe(2);
  });

  test("Deberia calcular la fecha del vuelo correctamente", () => {
    const { result } = renderHook(
      () =>
        useCardReservation({
          reservation: mockReservation,
          onCancelReservation: mockOnCancelReservation,
          isCancelling: false,
        }),
      { wrapper: TestWrapper }
    );

    expect(result.current.flightDate).toEqual(new Date("2025-12-25T10:00:00.000Z"));
    expect(result.current.isFlightPast).toBe(false);
  });

  test("Deberia validar los vuelos pasados", () => {
    const { result } = renderHook(
      () =>
        useCardReservation({
          reservation: mockPastReservation,
          onCancelReservation: mockOnCancelReservation,
          isCancelling: false,
        }),
      { wrapper: TestWrapper }
    );

    expect(result.current.isFlightPast).toBe(true);
  });

  describe("canRequestRefund logic", () => {
    test("Deberia dejar hacer reembolsos para reservas pagas", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.canRequestRefund).toBe(true);
    });

    test("No deberia dejar hacer reembolsos para vuelos cancelados", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockCancelledReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.canRequestRefund).toBe(false);
    });

    test("No deberia dejar hacer reembolsos para reservas que no tengan pagos confirmados", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockPendingReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.canRequestRefund).toBe(false);
    });
  });

  describe("canModifySeat logic", () => {

    test("should not allow seat modification for PAID reservations", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.canModifySeat).toBe(false);
    });

    it("should not allow seat modification for CANCELLED reservations", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockCancelledReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.canModifySeat).toBe(false);
    });
  });

  describe("handleModifySeat", () => {
    it("should navigate to home when seat can be modified", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockPendingReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.handleModifySeat();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should not navigate when seat cannot be modified", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.handleModifySeat();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("modal handling", () => {
    it("should show cancel modal when requesting refund", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      act(() => {
        result.current.handleRequestRefund();
      });

      expect(result.current.showCancelModal).toBe(true);
    });

    it("should close modal and call onCancelReservation when confirming refund", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      // First show the modal
      act(() => {
        result.current.handleRequestRefund();
      });

      // Then confirm the refund
      act(() => {
        result.current.handleConfirmRefund();
      });

      expect(result.current.showCancelModal).toBe(false);
      expect(mockOnCancelReservation).toHaveBeenCalledWith(mockReservation.reservationId);
    });

    it("should close modal when setting showCancelModal to false", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      // Show modal first
      act(() => {
        result.current.handleRequestRefund();
      });

      // Close modal
      act(() => {
        result.current.setShowCancelModal(false);
      });

      expect(result.current.showCancelModal).toBe(false);
    });
  });

  describe("status helpers", () => {
    it("should return correct status variant for PAID", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusVariant("PAID")).toBe("success");
    });

    it("should return correct status variant for CANCELLED", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusVariant("CANCELLED")).toBe("danger");
    });

    it("should return default status variant for unknown status", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusVariant("PENDING")).toBe("default");
    });

    it("should return correct status text for PAID", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusText("PAID")).toBe("Pagado");
    });

    it("should return correct status text for CANCELLED", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusText("CANCELLED")).toBe("Cancelado");
    });

    it("should return default status text for unknown status", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.getStatusText("PENDING")).toBe("Pendiente");
    });
  });

  describe("seat formatting", () => {
    it("should format single seat correctly", () => {
      const singleSeatReservation = {
        ...mockReservation,
        seats: [mockReservation.seats[0]],
      };

      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: singleSeatReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.seatNumbers).toBe("12A");
      expect(result.current.seatCount).toBe(1);
    });

    it("should format multiple seats correctly", () => {
      const { result } = renderHook(
        () =>
          useCardReservation({
            reservation: mockReservation,
            onCancelReservation: mockOnCancelReservation,
            isCancelling: false,
          }),
        { wrapper: TestWrapper }
      );

      expect(result.current.seatNumbers).toBe("12A, 12B");
      expect(result.current.seatCount).toBe(2);
    });
  });
});