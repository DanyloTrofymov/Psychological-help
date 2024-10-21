import { ClickAwayListener, Paper, Popper } from '@mui/material';
import { useState } from 'react';

import { Input } from '../ui/input';

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
					<Input
						placeholder={currentName}
						onChange={e => setNewName(e.target.value)}
					/>
				</Paper>
			</ClickAwayListener>
		</Popper>
	);
};

export default RenamePopup;
