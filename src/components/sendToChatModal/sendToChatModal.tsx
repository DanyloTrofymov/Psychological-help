import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

import Button from '../custom/Button';

const SendToChatModal = ({
	open,
	onClose,
	onAiSubmit,
	onTherapistSubmit
}: {
	open: boolean;
	onClose: () => void;
	onAiSubmit: () => void;
	onTherapistSubmit: () => void;
}) => (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>
			<Typography variant="h1">
				В який чат ви хочете відправити повідомлення?
			</Typography>
		</DialogTitle>
		<DialogContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
			<Button variant="contained" onClick={onAiSubmit}>
				Чат з ШІ
			</Button>
			<Button variant="contained" onClick={onTherapistSubmit}>
				Чат з терапевтом
			</Button>
		</DialogContent>
	</Dialog>
);

export default SendToChatModal;
