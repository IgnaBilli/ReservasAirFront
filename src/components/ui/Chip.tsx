import { ReactNode } from "react";

interface ChipProps {
	children: ReactNode;
	variant?: 'default' | 'success' | 'danger' | 'warning';
	size?: 'sm' | 'md';
}

export const Chip = ({ children, variant = 'default', size = 'md' }: ChipProps) => {
	const variants = {
		default: 'bg-gray-200 text-gray-700',
		success: 'bg-green-100 text-green-800',
		danger: 'bg-red-100 text-red-800',
		warning: 'bg-yellow-100 text-yellow-800'
	};

	const sizes = {
		sm: 'px-2 py-1 text-xs',
		md: 'px-3 py-1 text-sm'
	};

	return (
		<span className={`rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
			{children}
		</span>
	);
};

