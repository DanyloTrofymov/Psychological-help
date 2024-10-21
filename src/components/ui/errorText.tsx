import { cn } from '@/lib/utils';

const ErrorText = ({
	error,
	absolute
}: {
	error?: string | false;
	absolute?: boolean;
}) => {
	return (
		<>
			{error && (
				<div
					className={cn(
						'w-full mt-[2px] ml-3 text-xs text-wrap break-words text-red-500',
						{ absolute: absolute }
					)}
				>
					{error}
				</div>
			)}
		</>
	);
};

export default ErrorText;
