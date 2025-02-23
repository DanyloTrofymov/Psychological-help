import Image from 'next/image';
import { NextRouter } from 'next/router';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
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
				<div className="flex flex-row h-[calc(100vh-64px)] justify-center">
					<div className="flex flex-col justify-center gap-3 items-center">
						<Image
							src={'/logo-black.svg'}
							alt="logo"
							width={100}
							height={100}
						/>
						<p>Oops, there is an error!</p>
						<p className="text-2xl text-center text-gray-500 max-w-[1000px] overflow-hidden text-ellipsis whitespace-nowrap">
							{this.state.errorMessage}
						</p>
						{this.state.showMore && (
							<div className="border border-blue-500 bg-blue-500/50 border-radius-5px w-[80vw] max-w-[1200px] min-w-[500px] max-h-[calc(100%_-_370px)] overflow-y-auto p-2">
								<p className="text-gray-700">
									<span>Path: {HOST_ADDRESS + this.props.router.asPath}</span>
									<br />
									<span>Route: {this.props.router.pathname}</span>
									<br />
									<br />
									<span>{this.state.errorStack}</span>
								</p>
							</div>
						)}
						<div className="flex flex-row gap-3">
							{this.state.errorStack && (
								<Button onClick={() => this.handleAction()}>
									{this.state.showMore ? 'Copy info' : 'Show more info'}
								</Button>
							)}
							<Button onClick={() => this.handleTryAgain()}>Reload page</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundaryClass;
