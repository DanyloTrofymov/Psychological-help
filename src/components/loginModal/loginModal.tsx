import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

import Button from '../custom/Button';

const LoginModal = ({
	open,
	onClose
}: {
	open: boolean;
	onClose: () => void;
}) => (
	<Dialog open={open} onClose={onClose}>
		<DialogTitle>
			<Typography variant="h1">
				Для цієї дії необхідно авторизуватися
			</Typography>
		</DialogTitle>
		<DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
			<Button variant="contained" onClick={onClose}>
				Ок
			</Button>
		</DialogContent>
	</Dialog>
);

export default LoginModal;
