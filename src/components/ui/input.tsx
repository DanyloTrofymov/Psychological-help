import { CircleX } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import ErrorText from './errorText';
import Placeholder from './placeholder';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		error?: false | string;
		clearOption?: boolean;
		errorAbsolute?: boolean;
		placeholderTransparent?: boolean;
	}
>(
	(
		{
			className,
			type,
			required,
			placeholder,
			error,
			clearOption,
			errorAbsolute,
			placeholderTransparent,
			...props
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const [isAutofilled, setIsAutofilled] = useState(false);
		const inputRef = useRef<HTMLInputElement | null>(null);

		const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
			setIsFocused(true);
			props.onFocus && props.onFocus(e);
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
			setIsFocused(false);
			props.onBlur && props.onBlur(e);
		};

		const handleAnimationStart = (e: AnimationEvent) => {
			if (e.animationName === 'onAutoFillStart') {
				setIsAutofilled(true);
			} else if (e.animationName === 'onAutoFillCancel') {
				setIsAutofilled(false);
			}
		};

		useEffect(() => {
			const input = inputRef.current;
			input && input.addEventListener('animationstart', handleAnimationStart);
			return () => {
				input &&
					input.removeEventListener('animationstart', handleAnimationStart);
			};
		}, []);

		const _placeholder = required ? `${placeholder}*` : placeholder;

		const handlePlaceholderClick = () => {
			inputRef.current?.focus();
		};

		const handleClear = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const mockEvent = { target: { value: '' } };
			props.onChange &&
				props.onChange(mockEvent as React.ChangeEvent<HTMLInputElement>);
		};

		return (
			<div className={cn('relative group', className)}>
				<input
					{...props}
					type={type}
					className={cn(
						'w-[100%] flex h-10 rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground elem-hover',
						{ 'border-red-500 focus-visible:ring-red-500': error },
						className
					)}
					ref={el => {
						inputRef.current = el;
						if (typeof ref === 'function') {
							ref(el);
						} else if (ref) {
							(ref as React.MutableRefObject<HTMLInputElement | null>).current =
								el;
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
						focused={
							(type !== 'checkbox' && isFocused) ||
							!!props.value ||
							props.value === 0 ||
							isAutofilled ||
							type === 'file'
						}
						error={!!error}
						placeholder={_placeholder}
						transparent={placeholderTransparent}
						onClick={handlePlaceholderClick}
					/>
				)}
				<ErrorText error={error} absolute={errorAbsolute} />
			</div>
		);
	}
);
Input.displayName = 'Input';

export { Input };
