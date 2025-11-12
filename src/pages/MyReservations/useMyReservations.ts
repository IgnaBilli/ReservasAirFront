// src/pages/MyReservations/useMyReservations.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { reservationsService } from '@/services/api';
import { Reservation } from '@/interfaces';
import { toast } from 'react-toastify';

export const useMyReservations = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAppStore();
	const userId = user?.id;
	const [cancellingId, setCancellingId] = useState<number | null>(null);

	// Fetch user reservations
	const {
		data: reservations = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['reservations', userId],
		queryFn: () => {
			if (!userId) throw new Error('User ID is required');
			return reservationsService.getUserReservations(userId);
		},
		staleTime: 1000 * 60 * 5, // 5 minutes - longer cache time
		refetchOnWindowFocus: false, // Don't refetch on window focus
		enabled: !!userId, // Only run query if userId exists
	});

	// Mutation for cancelling reservation
	const cancelReservationMutation = useMutation({
		mutationFn: async (reservationId: number) => {
			if (!userId) throw new Error('User ID is required');
			setCancellingId(reservationId);

			// Cancel reservation
			await reservationsService.cancelReservation(reservationId);

			return reservationId;
		},
		onMutate: async (reservationId) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['reservations', userId] });

			// Snapshot the previous value
			const previousReservations = queryClient.getQueryData(['reservations', userId]);

			// Optimistically update the cache
			queryClient.setQueryData(['reservations', userId], (old: Reservation[] = []) => {
				return old.map(reservation =>
					reservation.reservationId === reservationId
						? { ...reservation, status: 'CANCELLED' }
						: reservation
				);
			});

			// Return a context with the previous data
			return { previousReservations };
		},
		onError: (error, _reservationId, context) => {
			// If the mutation fails, use the context to roll back
			if (context?.previousReservations) {
				queryClient.setQueryData(['reservations', userId], context.previousReservations);
			}

			console.error('Error cancelling reservation:', error);
			toast.error("Error al procesar el reembolso. Por favor intente nuevamente.", {
				closeButton: false,
				autoClose: 3000
			});

			setCancellingId(null);
		},
		onSuccess: () => {
			toast.success("Reembolso solicitado con éxito", {
				closeButton: false,
				autoClose: 3000
			});

			setCancellingId(null);
			
			// Refetch reservations to get updated data from server
			queryClient.invalidateQueries({
				queryKey: ['reservations', userId]
			});
		},
		onSettled: () => {
			// Refetch after operation completes
			queryClient.refetchQueries({
				queryKey: ['reservations', userId]
			});
		}
	});

	const handleBackToSearch = () => {
		navigate('/');
	};

	const handleCancelReservation = (reservationId: number) => {
		cancelReservationMutation.mutate(reservationId);
	};

	// Sort reservations by creation date (newest first)
	const sortedReservations = (Array.isArray(reservations) ? [...reservations] : []).sort((a: Reservation, b: Reservation) =>
		new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	return {
		reservations: sortedReservations,
		isLoading,
		error,
		cancellingId, // Return the ID that is currently being cancelled
		handleBackToSearch,
		handleCancelReservation
	};
};