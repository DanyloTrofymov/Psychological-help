import { CircularProgress } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

import Button from '../custom/Button';

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
		<Dialog
			open={open}
			onClose={onCancel}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			{...props}
		>
			<DialogTitle
				sx={{ textAlign: 'center' }}
				id="alert-dialog-title"
				variant="h1"
			>
				{title || 'Are you sure you want to commit this action?'}
			</DialogTitle>
			{text && (
				<DialogContent>
					<DialogContentText
						id="alert-dialog-description"
						variant="body1"
						color="var(--gray-1)"
					>
						{text}
					</DialogContentText>
				</DialogContent>
			)}
			<DialogActions>
				<Button
					color={buttonColor ? buttonColor : 'error'}
					onClick={onCancel}
					sx={{ mr: 'auto' }}
				>
					Відмінити
				</Button>
				<Button
					onClick={onAccept}
					autoFocus
					variant="contained"
					sx={{ ml: 'auto' }}
				>
					{isWaiting ? (
						<CircularProgress size={24} />
					) : (
						agreeButtonText || 'Так'
					)}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
