import { DialogProps } from '@radix-ui/react-dialog';

import { Button } from '@/components/ui/button';

import CenteredLoader from '../custom/CenteredLoader';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle
} from '../ui/dialog';

type Props = DialogProps & {
	open: boolean;
	title?: string;
	text?: string;
	agreeButtonText?: string;
	onAccept: () => void;
	onCancel: () => void;
	isWaiting?: boolean;
	dialogProps?: any;
	buttonColor?:
		| 'inherit'
		| 'error'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'info'
		| 'warning'
		| undefined;
};

export default function AlertDialog({
	open,
	title,
	text,
	agreeButtonText,
	onAccept,
	onCancel,
	isWaiting,
	buttonColor,
	...props
}: Props) {
	return (
		<Dialog open={open} onOpenChange={open => !open && onCancel()} {...props}>
			<DialogContent>
				<DialogTitle className="text-center">
					{title || 'Are you sure you want to commit this action?'}
				</DialogTitle>
				{text && (
					<DialogDescription color="var(--gray-1)">{text}</DialogDescription>
				)}
				<div className="flex flex-row gap-2">
					<Button
						color={buttonColor ? buttonColor : 'error'}
						onClick={onCancel}
						className="mr-auto"
					>
						Відмінити
					</Button>
					<Button onClick={onAccept} autoFocus className="ml-auto">
						{isWaiting ? <CenteredLoader /> : agreeButtonText || 'Так'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
