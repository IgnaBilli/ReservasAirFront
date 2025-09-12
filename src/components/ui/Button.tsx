import { ReactNode } from 'react';

interface ButtonProps {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'danger' | 'success';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	className?: string;
}

export const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	disabled,
	loading,
	onClick,
	className = ''
}: ButtonProps) => {
	const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variants = {
		primary: 'bg-[#74B5CD] hover:bg-[#5da3bd] text-white border border-[#74B5CD]',
		secondary: 'bg-[#E5E5E5] hover:bg-[#d5d5d5] text-gray-800 border border-[#E5E5E5]',
		danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-500',
		success: 'bg-green-500 hover:bg-green-600 text-white border border-green-500'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{loading && (
				<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
			)}
			{children}
		</button>
	);
};