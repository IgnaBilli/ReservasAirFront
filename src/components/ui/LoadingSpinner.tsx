// src/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
	const sizes = {
		sm: 'h-4 w-4 border-2',
		md: 'h-8 w-8 border-3',
		lg: 'h-12 w-12 border-4'
	};

	return (
		<div
			className={`animate-spin rounded-full ${sizes[size]} border-gray-300 border-t-[#74B5CD] ${className}`}
			aria-label="Loading"
		/>
	);
};