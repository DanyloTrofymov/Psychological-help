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
		color: 'var(--secondary-blue)',
		boxSizing: 'border-box',
		boxShadow: 'none',
		border: 'none',
		padding: '15px 30px 15px 30px',
		textDecoration: link ? 'underline' : 'none',
		'&:hover': {
			color: 'var(--button-hover)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		'&:focus-visible': {
			backgroundColor: 'var(--transparent-secondary-blue)',
			Opacity: '0.2',
			color: 'var(--button-hover)',
			boxShadow: 'none'
		},
		'&:active:focus': {
			color: 'var(--button-active)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		'&:disabled': {
			color: 'var(--button-disabled)',
			backgroundColor: 'transparent',
			boxShadow: 'none'
		},
		...(variant == 'contained' && {
			color: 'var(--nero)',
			fontSize: '14px',
			lineHeight: '20px',
			gap: '10px',
			backgroundColor: 'var(--secondary-blue)',
			textDecoration: 'none',
			'&:hover': {
				backgroundColor: 'var(--button-hover)',
				color: 'var(--nero)'
			},
			'&:active:focus': {
				backgroundColor: 'var(--button-hover)',
				webkitBoxShadow: 'inset 0px 0px 0px 2px var(--secondary-blue)',
				mozBoxShadow: 'inset 0px 0px 0px 2px var(--secondary-blue)',
				boxShadow: 'inset 0px 0px 0px 2px var(--secondary-blue)',
				color: 'var(--nero)'
			},
			'&:active': {
				backgroundColor: 'var(--button-active)',
				color: 'var(--nero)'
			},
			'&:disabled': {
				backgroundColor: 'var(--button-disabled)',
				color: 'var(--nero)'
			},
			...(big && {
				padding: '15px 126px 15px 126px'
			})
		})
	})
);

export default Button;
