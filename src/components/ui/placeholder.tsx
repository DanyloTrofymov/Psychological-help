import { MouseEvent } from 'react';

import { cn } from '@/lib/utils';

const Placeholder = ({
	focused,
	cursor = 'cursor-text',
	onClick,
	transparent,
	error,
	className,
	placeholder
}: {
	focused?: boolean;
	error?: boolean;
	placeholder: string;
	transparent?: boolean;
	cursor?: 'cursor-text' | 'cursor-pointer';
	className?: string;
	onClick?: (e?: MouseEvent) => void;
}) => {
	return (
		<div
			className={cn(
				'absolute left-2 top-[9px] text-sm text-muted-foreground transition-all duration-200 bg-transparent px-1 select-none shadow-right-left',
				{ 'top-[-6px] text-xs bg-half-white-transparent z-50': focused },
				{ 'text-xs bg-70-white-transparent z-50': transparent && focused },
				{ 'text-red-500': error },
				className
			)}
			onClick={onClick}
		>
			<p className={cn(`${focused ? '' : cursor}`)}>{placeholder}</p>
		</div>
	);
};

export default Placeholder;
