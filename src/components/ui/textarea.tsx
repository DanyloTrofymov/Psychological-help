import { CircleX } from 'lucide-react';
import * as React from 'react';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import ErrorText from './errorText';
import Placeholder from './placeholder';

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: false | string;
	clearOption?: boolean;
	errorAbsolute?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			required,
			placeholder,
			error,
			clearOption,
			errorAbsolute,
			...props
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const inputRef = useRef<HTMLTextAreaElement | null>(null);

		const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
			setIsFocused(true);
			props.onFocus && props.onFocus(e);
		};

		const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
			setIsFocused(false);
			props.onBlur && props.onBlur(e);
		};

		const _placeholder = required ? `${placeholder}*` : placeholder;

		const handlePlaceholderClick = () => {
			inputRef.current?.focus();
		};

		const handleClear = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const mockEvent = { target: { value: '' } };
			props.onChange &&
				props.onChange(mockEvent as React.ChangeEvent<HTMLTextAreaElement>);
		};

		return (
			<div className="relative group w-full">
				<textarea
					{...props}
					className={cn(
						'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground elem-hover',
						{ 'border-red-500 focus-visible:ring-red-500': error },
						className
					)}
					ref={el => {
						inputRef.current = el;
						if (typeof ref === 'function') {
							ref(el);
						} else if (ref) {
							(
								ref as React.MutableRefObject<HTMLTextAreaElement | null>
							).current = el;
						}
					}}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				{clearOption && props.value && (
					<div className="absolute top-1 right-2 p-2" onClick={handleClear}>
						<CircleX className="ml-auto size-4 shrink-0 opacity-50" />
					</div>
				)}
				{_placeholder && (
					<Placeholder
						focused={isFocused || !!props.value}
						textArea={true}
						error={!!error}
						placeholder={_placeholder}
						onClick={handlePlaceholderClick}
					/>
				)}
				<ErrorText error={error} absolute={errorAbsolute} />
			</div>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };
