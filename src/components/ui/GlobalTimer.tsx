import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface GlobalTimerProps {
	onTimeUp: () => void;
	className?: string;
}

export const GlobalTimer = ({ onTimeUp, className = '' }: GlobalTimerProps) => {
	const { isTimerActive, getTimeLeft } = useAppStore();
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		if (!isTimerActive) {
			setTimeLeft(0);
			return;
		}

		const updateTimer = () => {
			const remaining = getTimeLeft();
			setTimeLeft(remaining);

			if (remaining <= 0) {
				onTimeUp();
			}
		};

		// Update immediately
		updateTimer();

		// Then update every second
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [isTimerActive, getTimeLeft, onTimeUp]);

	if (!isTimerActive || timeLeft <= 0) {
		return null;
	}

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const isUrgent = timeLeft <= 60; // Último minuto

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<span className="text-sm text-gray-600">Tiempo restante:</span>
			<span className={`font-mono font-bold text-lg px-2 py-1 rounded ${isUrgent ? 'text-red-600 bg-red-100' : 'text-gray-800 bg-gray-100'
				}`}>
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</span>
		</div>
	);
};