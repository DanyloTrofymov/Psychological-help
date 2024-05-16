import { Stack } from '@mui/material';
import { ReactNode } from 'react';

const CenteredContainer = ({ children }: { children: ReactNode }) => (
	<Stack
		direction="row"
		sx={{
			height: 'calc(100%)',
			justifyContent: 'center'
		}}
	>
		<Stack
			sx={{
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{children}
		</Stack>
	</Stack>
);

export default CenteredContainer;
