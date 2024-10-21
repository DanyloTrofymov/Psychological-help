import UploadFileIcon from '@mui/icons-material/UploadFile';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {
	Box,
	CircularProgress,
	Dialog,
	Divider,
	Slider,
	Stack,
	Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { MESSAGE_TYPE } from '@/data/messageData';

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
			maxWidth="md"
			scroll="body"
			open={isOpen}
			onClose={() => {
				!loader && handleClose();
			}}
		>
			<Stack direction="column" sx={{ alignItems: 'center' }}>
				{loader ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '70px',
							height: '70px'
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<Box>
						{file ? (
							<Stack
								direction="column"
								sx={{ alignItems: 'center', width: '600px', height: '620px' }}
							>
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
								<Stack
									direction="row"
									sx={{
										width: 500,
										justifyContent: 'center',
										alignItems: 'center',
										mb: '5px'
									}}
								>
									<Button
										onClick={() => handleZoom(false)}
										disabled={zoom == 1}
										className="p-0 rounded-full w-10"
									>
										<ZoomOutIcon />
									</Button>
									<Slider
										value={zoom}
										min={1}
										max={3}
										step={0.05}
										aria-labelledby="Zoom"
										onChange={(e, zoom) => setZoom(Number(zoom))}
										sx={{ width: '50%', m: '5px' }}
									/>
									<Button
										onClick={() => handleZoom(true)}
										disabled={zoom == 3}
										className="p-0 rounded-full w-10"
									>
										<ZoomInIcon />
									</Button>
								</Stack>
								<Divider sx={{ width: 600, mb: '15px' }} />
								<Stack
									direction="row"
									sx={{
										width: 500,
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
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
								</Stack>
							</Stack>
						) : (
							<Box
								sx={{
									width: '400px',
									height: '200px',
									margin: '30px',
									borderStyle: 'dashed',
									borderColor: isDragOver ? 'primary' : 'text.secondary',
									alignItems: 'center',
									display: 'flex',
									justifyContent: 'center',
									cursor: 'pointer',
									backgroundColor: isDragOver ? '#646482' : ''
								}}
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
								<Stack {...getRootProps()}>
									<Box
										sx={{
											alignItems: 'center',
											display: 'flex',
											justifyContent: 'center'
										}}
										{...getRootProps()}
									>
										<Typography
											sx={{ mr: '10px', cursor: 'pointer' }}
											component="label"
											variant="h2"
											color={isDragOver ? 'primary' : 'text.secondary'}
										>
											Upload image
										</Typography>
										<UploadFileIcon
											sx={{
												height: '2rem',
												width: '2rem',
												color: isDragOver ? 'primary' : 'text.secondary',
												cursor: 'pointer'
											}}
										/>
									</Box>
									<Typography
										sx={{ mr: '10px', cursor: 'pointer' }}
										color={isDragOver ? 'primary' : 'text.secondary'}
										variant="h3"
									>
										Drag photo here or click to browse
									</Typography>
								</Stack>
							</Box>
						)}
					</Box>
				)}
			</Stack>
		</Dialog>
	);
}
