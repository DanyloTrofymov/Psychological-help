export interface mediaUpload {
	isOpen: boolean;
	onClose: () => void;
	handleSave: (file: File) => Promise<void>;
}
