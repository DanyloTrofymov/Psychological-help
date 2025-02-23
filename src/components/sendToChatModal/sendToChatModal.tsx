import { Button } from '@/components/ui/button';

import CenteredLoader from '../custom/CenteredLoader';
import { AlertDialog, AlertDialogContent } from '../ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

const SendToChatModal = ({
	open,
	isLoading,
	onOpenChange,
	onAiSubmit,
	onTherapistSubmit
}: {
	open: boolean;
	isLoading: boolean;
	onOpenChange: (open: boolean) => void;
	onAiSubmit: () => void;
	onTherapistSubmit: () => void;
}) => (
	<>
		{isLoading ? (
			<AlertDialog open={isLoading}>
				<AlertDialogContent className="max-w-36">
					<div className="h-24 w-24">
						<CenteredLoader />
					</div>
				</AlertDialogContent>
			</AlertDialog>
		) : (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						В який чат ви хочете відправити повідомлення?
					</DialogHeader>
					<div className="flex justify-between w-full">
						<Button onClick={onAiSubmit}>Чат з ШІ</Button>
						<Button onClick={onTherapistSubmit}>Чат з терапевтом</Button>
					</div>
				</DialogContent>
			</Dialog>
		)}
	</>
);

export default SendToChatModal;
