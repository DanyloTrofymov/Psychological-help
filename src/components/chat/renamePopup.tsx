import { ClickAwayListener, Paper, Popper, TextField } from '@mui/material';
import { useState } from 'react';

const RenamePopup = ({
	anchorEl,
	onClose,
	currentName,
	onSubmit
}: {
	anchorEl: HTMLElement | null | undefined;
	currentName: string;
	onSubmit: (name: string) => void;
	onClose: () => void;
}) => {
	const [newName, setNewName] = useState('');
	const handleRename = () => {
		if (newName) {
			onSubmit(newName);
		}
		onClose();
	};
	return (
		<Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom-start">
			<ClickAwayListener onClickAway={handleRename}>
				<Paper sx={{ p: 1 }}>
					<TextField
						label={currentName}
						onChange={e => setNewName(e.target.value)}
					/>
				</Paper>
			</ClickAwayListener>
		</Popper>
	);
};

export default RenamePopup;
