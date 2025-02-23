import { ReactNode } from 'react';

const CenteredContainer = ({ children }: { children: ReactNode }) => (
	<div className="flex flex-row h-full justify-center">
		<div className="flex flex-col justify-center items-center">{children}</div>
	</div>
);

export default CenteredContainer;
