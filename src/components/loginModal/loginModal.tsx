import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const LoginModal = ({
	open,
	onOpenChange
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogTitle>
				<p className="text-2xl font-semibold">
					Для цієї дії необхідно авторизуватися
				</p>
			</DialogTitle>
			<div className="flex flex-col gap-2 items-center">
				<Button onClick={() => onOpenChange(false)} className="w-min">
					Ок
				</Button>
			</div>
		</DialogContent>
	</Dialog>
);

export default LoginModal;
