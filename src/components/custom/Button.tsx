import { styled } from '@mui/material';
import LegacyButton from '@mui/material/Button';

interface ButtonProps {
	big?: boolean;
	variant?: 'contained' | 'outlined' | 'text';
	link?: boolean;
	component?: string;
}

const Button = styled(LegacyButton)<ButtonProps>(
	({ big, variant = 'text', link }) => ({
		borderRadius: '10px',
		font: 'Roboto',
		fontSize: '14px',
		fontWeight: '600',
		lineHeight: '20px',
		letterSpacing: '0em',
		backgroundColor: 'transparent',
		color: 'var(--green)',
		boxSizing: 'border-box',
		boxShadow: 'none',
		border: 'none',
		padding: '15px 30px 15px 30px',
		textDecoration: link ? 'underline' : 'none',
		'&:hover': {
			color: 'var(--green)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		'&:focus-visible': {
			backgroundColor: 'var(--green)',
			Opacity: '0.2',
			color: 'var(--green)',
			boxShadow: 'none'
		},
		'&:active:focus': {
			color: 'var(--green)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		'&:disabled': {
			color: 'var(--green)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		...(variant == 'contained' && {
			color: 'var(--nero)',
			fontSize: '14px',
			lineHeight: '20px',
			gap: '10px',
			backgroundColor: 'var(--green)',
			textDecoration: 'none',
			'&:hover': {
				backgroundColor: 'var(--green-hover)',
				color: 'var(--nero)'
			},
			'&:active:focus': {
				backgroundColor: 'var(--green)',
				webkitBoxShadow: 'inset 0px 0px 0px 2px var(--green)',
				mozBoxShadow: 'inset 0px 0px 0px 2px var(--green)',
				boxShadow: 'inset 0px 0px 0px 2px var(--green)',
				color: 'var(--nero)'
			},
			'&:active': {
				backgroundColor: 'var(--green-hover)',
				color: 'var(--nero)'
			},
			'&:disabled': {
				backgroundColor: 'var(--light-gray)',
				color: 'var(--nero)'
			},
			...(big && {
				padding: '15px 126px 15px 126px'
			})
		})
	})
);

export default Button;
