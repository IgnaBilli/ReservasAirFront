import { useEffect, useState } from 'react';

interface TimerProps {
	initialMinutes: number;
	onTimeUp: () => void;
	className?: string;
}

export const Timer = ({ initialMinutes, onTimeUp, className = '' }: TimerProps) => {
	const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

	useEffect(() => {
		if (timeLeft <= 0) {
			onTimeUp();
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft, onTimeUp]);

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