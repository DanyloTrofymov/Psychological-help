import {
	Dialog,
	DialogContent,
	DialogTitle,
	Stack,
	Typography
} from '@mui/material';

import Button from '../custom/Button';
import CenteredLoader from '../custom/CenteredLoader';

const SendToChatModal = ({
	open,
	isLoading,
	onClose,
	onAiSubmit,
	onTherapistSubmit
}: {
	open: boolean;
	isLoading: boolean;
	onClose: () => void;
	onAiSubmit: () => void;
	onTherapistSubmit: () => void;
}) => (
	<>
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
		<Dialog open={isLoading}>
			<Stack sx={{ height: '100px', width: '100px' }}>
				<CenteredLoader />
			</Stack>
		</Dialog>
	</>
);

export default SendToChatModal;
