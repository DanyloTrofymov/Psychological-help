import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CenteredLoader = () => (
	<Stack
		direction="row"
		sx={{
			height: 'calc(100% - 64px)',
			justifyContent: 'center'
		}}
	>
		<Stack
			sx={{
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<CircularProgress />
		</Stack>
	</Stack>
);

export default CenteredLoader;
