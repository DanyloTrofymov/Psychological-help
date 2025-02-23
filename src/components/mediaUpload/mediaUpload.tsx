import { FileUpIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useCallback, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { MESSAGE_TYPE } from '@/data/messageData';
import { cn } from '@/lib/utils';

import CenteredLoader from '../custom/CenteredLoader';
import { Dialog, DialogContent } from '../ui/dialog';
import { Slider } from '../ui/slider';
import { mediaUpload } from './mediaUpload.interface';

export default function UploadMedia({
	isOpen,
	onClose,
	handleSave
}: mediaUpload) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [fileURL, setFileURL] = useState<string | undefined>(undefined);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const [loader, setLoader] = useState<boolean>(false);

	const getCroppedImg = async (): Promise<Blob> => {
		const image = new Image();
		image.src = fileURL!;
		await new Promise(resolve => {
			image.onload = resolve;
		});

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;
		const pixelRatio = window.devicePixelRatio;
		canvas.width = croppedAreaPixels!.width * pixelRatio;
		canvas.height = croppedAreaPixels!.height * pixelRatio;

		ctx.drawImage(
			image,
			croppedAreaPixels!.x,
			croppedAreaPixels!.y,
			croppedAreaPixels!.width,
			croppedAreaPixels!.height,
			0,
			0,
			canvas.width,
			canvas.height
		);

		return new Promise((resolve, reject) => {
			canvas.toBlob(blob => {
				if (!blob) {
					reject(new Error('Canvas is empty'));
					return;
				}
				resolve(blob);
			}, 'image/*');
		});
	};

	const saveImage = async () => {
		setLoader(true);
		try {
			const croppedImageBlob = await getCroppedImg();
			const croppedFile = new File([croppedImageBlob], file!.name, {
				type: 'image/*'
			});
			await handleSave(croppedFile);
		} catch (error) {
			enqueueSnackbar('Error cropping image.', { variant: MESSAGE_TYPE.ERROR });
		} finally {
			handleClose();
		}
	};

	const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		setIsDragOver(true);
		e.preventDefault();
	}, []);

	const onDragLeave = useCallback(() => {
		setIsDragOver(false);
	}, []);

	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			handleFileInputChange(files[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFileInputChange(files[0]);
		}
	};

	const handleFileInputChange = (file: File) => {
		const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
		if (parseFloat(sizeInMB) > 2) {
			enqueueSnackbar(
				"The size of the uploaded photo is more than 2 MB. The photo can't be saved.",
				{
					variant: MESSAGE_TYPE.ERROR
				}
			);
		} else {
			setFile(file);
			setFileURL(URL.createObjectURL(file));
		}
	};

	const handleZoom = (isZoomIn: boolean) => {
		if (isZoomIn) {
			if (zoom + 0.2 >= 3.0) {
				setZoom(3.0);
			} else {
				setZoom(zoom + 0.2);
			}
		} else {
			if (zoom - 0.2 <= 1.0) {
				setZoom(1.0);
			} else {
				setZoom(zoom - 0.2);
			}
		}
	};

	const getRootProps = () => ({
		onDrop,
		onDragOver,
		onDragLeave
	});

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			setFile(undefined);
			setFileURL(undefined);
			setZoom(1);
			setLoader(false);
		}, 200);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={open => {
				!loader && !open && handleClose();
			}}
		>
			<DialogContent className="p-2 max-w-[620px] w-min">
				<div className="flex flex-col gap-2 items-center">
					{loader ? (
						<CenteredLoader />
					) : (
						<div>
							{file ? (
								<div className="flex flex-col gap-2 items-center w-[600px] h-[620px]">
									<Cropper
										style={{
											containerStyle: {
												minWidth: '600px',
												minHeight: '480px',
												marginBottom: '10px',
												position: 'relative'
											}
										}}
										image={fileURL}
										crop={crop}
										zoom={zoom}
										onCropChange={setCrop}
										onZoomChange={setZoom}
										zoomSpeed={0.1}
										aspect={1}
										showGrid={false}
										cropShape="rect"
										onCropComplete={(croppedArea, croppedAreaPixels) =>
											setCroppedAreaPixels(croppedAreaPixels)
										}
									/>
									<div className="flex flex-row gap-2 items-center w-[500px] justify-center mb-5">
										<Button
											onClick={() => handleZoom(false)}
											disabled={zoom == 1}
											className="p-0 rounded-full w-10"
											variant="ghost"
										>
											<ZoomOutIcon />
										</Button>
										<Slider
											value={[zoom]}
											defaultValue={[zoom]}
											min={1}
											max={3}
											step={0.05}
											aria-labelledby="Zoom"
											onValueChange={val => setZoom(val[0])}
										/>
										<Button
											onClick={() => handleZoom(true)}
											disabled={zoom == 3}
											className="p-0 rounded-full w-10"
											variant="ghost"
										>
											<ZoomInIcon />
										</Button>
									</div>
									<div className="w-[600px] border-b" />
									<div className="flex flex-row gap-2 items-center w-[500px] justify-center mb-5">
										<Button
											disabled={fileURL == undefined}
											onClick={() => handleClose()}
										>
											Cancel
										</Button>
										<Button
											disabled={fileURL == undefined}
											onClick={() => saveImage()}
											className="ml-auto"
										>
											Save
										</Button>
									</div>
								</div>
							) : (
								<div
									className={cn(
										'border-dashed border-4 border-gray-300 rounded-md w-[400px] h-[200px] m-5 flex items-center justify-center cursor-pointer bg-gray-100',
										isDragOver && 'bg-gray-200'
									)}
									onClick={() => fileInputRef.current?.click()}
									{...getRootProps()}
								>
									<input
										hidden
										accept="image/*"
										type="file"
										ref={fileInputRef}
										onChange={onInputFile}
									/>
									<div
										className="flex flex-col items-center justify-center"
										{...getRootProps()}
									>
										<div
											className="flex flex-row items-center justify-center"
											{...getRootProps()}
										>
											<p
												className={cn(
													'mr-2 cursor-pointer text-lg',
													{ 'text-gray-300': isDragOver },
													{ 'text-gray-500': !isDragOver }
												)}
											>
												Upload image
											</p>
											<FileUpIcon
												className={cn(
													'h-6 w-6 cursor-pointer',
													{ 'text-gray-300': isDragOver },
													{ 'text-gray-500': !isDragOver }
												)}
											/>
										</div>
										<p
											className={cn(
												'cursor-pointer',
												{ 'text-gray-300': isDragOver },
												{ 'text-gray-500': !isDragOver }
											)}
										>
											Drag photo here or click to browse
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
