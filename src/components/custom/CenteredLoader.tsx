import { LoaderCircleIcon } from 'lucide-react';

import CenteredContainer from './CenteredContainer';

const CenteredLoader = () => (
	<CenteredContainer>
		<LoaderCircleIcon className="w-10 h-10 animate-spin" />
	</CenteredContainer>
);

export default CenteredLoader;
