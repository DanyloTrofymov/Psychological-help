import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { NextRouter } from 'next/router';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import Button from '@/components/custom/Button';
import { HOST_ADDRESS } from '@/data/apiConstants';
import { MESSAGE_TYPE } from '@/data/messageData';

interface Props {
	children?: ReactNode;
	router: NextRouter;
	enqueueSnackbar: (
		message: SnackbarMessage,
		options?: OptionsObject | undefined
	) => SnackbarKey;
}

interface State {
	errorMessage: string;
	errorStack: string;
	showMore: boolean;
}

class ErrorBoundaryClass extends Component<Props, State> {
	public state: State = {
		errorMessage: '',
		errorStack: '',
		showMore: false
	};

	public static getDerivedStateFromError(e: Error): State {
		return {
			showMore: false,
			errorMessage: `${e.name}: ${e.message} `,
			errorStack: e.stack || ''
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public handleTryAgain(): void {
		this.setState(prevState => ({
			...prevState,
			errorMessage: '',
			showMore: false
		}));
		this.props.router.reload();
	}

	public showMoreInfo(): void {
		this.setState(prevState => ({
			...prevState,
			showMore: true
		}));
	}

	public copyText(): void {
		navigator.clipboard
			.writeText(
				`Path: ${HOST_ADDRESS + this.props.router.asPath}\nRoute: + ${
					HOST_ADDRESS + this.props.router.pathname
				}\n\n${this.state.errorStack}`
			)
			.then(() => {
				this.props.enqueueSnackbar('Copied to clipboard', {
					variant: MESSAGE_TYPE.SUCCESS
				});
			})
			.catch(() => {
				this.props.enqueueSnackbar('Failed to copy text', {
					variant: MESSAGE_TYPE.ERROR
				});
			});
	}

	public handleAction(): void {
		if (!this.state.showMore) {
			this.showMoreInfo();
		} else {
			this.copyText();
		}
	}

	public render() {
		if (this.state.errorMessage.length) {
			return (
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
							alignItems: 'center',
							gap: 3
						}}
					>
						<Image src={'/logo-black.svg'} alt="logo" />
						<Typography>Oops, there is an error!</Typography>
						<Typography
							variant="h1"
							sx={{
								color: theme =>
									theme.palette.mode == 'dark' ? '#eees' : 'var(--grey)',
								maxWidth: '1000px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap'
							}}
						>
							{this.state.errorMessage}
						</Typography>
						{this.state.showMore && (
							<Box
								sx={{
									border: '1px solid ',
									borderColor: '#87CEFA',
									backgroundColor: '#87CEFA55',
									borderRadius: '5px',
									width: '80vw',
									maxWidth: '1200px',
									minWidth: '500px',
									maxHeight: 'calc(100% - 370px)',
									overflowY: 'auto',
									p: 2
								}}
							>
								<Typography
									variant="body1"
									sx={{
										color: '#eee'
									}}
								>
									<span>Path: {HOST_ADDRESS + this.props.router.asPath}</span>
									<br />
									<span>Route: {this.props.router.pathname}</span>
									<br />
									<br />
									<span>{this.state.errorStack}</span>
								</Typography>
							</Box>
						)}
						<Box>
							{this.state.errorStack && (
								<Button
									onClick={() => this.handleAction()}
									sx={{ mr: 3, width: '190px' }}
								>
									{this.state.showMore ? 'Copy info' : 'Show more info'}
								</Button>
							)}
							<Button
								variant="contained"
								onClick={() => this.handleTryAgain()}
								sx={{ width: ' 190px' }}
							>
								Reload page
							</Button>
						</Box>
					</Stack>
				</Stack>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundaryClass;
