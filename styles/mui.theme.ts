import { createTheme } from '@mui/material';

const typograhpy = {
	font: 'Roboto',
	fontSize: 16,
	fontWeight: 'normal',
	lineHeight: '24px',
	letterSpacing: '0em',
	h1: {
		font: 'Roboto',
		fontSize: 20,
		fontWeight: 600,
		lineHeight: '28px',
		letterSpacing: '0em'
	},
	h2: {
		font: 'Roboto',
		fontSize: 18,
		fontWeight: 600,
		lineHeight: '26px',
		letterSpacing: '0em'
	},
	h3: {
		font: 'Roboto',
		fontSize: 16,
		fontWeight: 500,
		lineHeight: '24px',
		letterSpacing: '0em'
	},
	h4: {
		font: 'Roboto',
		fontSize: 14,
		fontWeight: 600,
		lineHeight: '18px',
		letterSpacing: '0em'
	},
	body1: {
		font: 'Roboto',
		fontSize: 16,
		fontWeight: 'normal',
		lineHeight: '24px',
		letterSpacing: '0em'
	},
	body2: {
		font: 'Gilory',
		fontSize: 14,
		fontWeight: 'normal',
		lineHeight: '18px',
		letterSpacing: '0em'
	}
};

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			dark: '#095899',
			main: '#90CAF9',
			light: '#42A5F5'
		},
		secondary: {
			main: '#90CAF9',
			light: '#FFD896'
		},
		error: {
			main: '#FD3636'
		}
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: '#EBF0F5',
					borderRadius: '10px',
					color: '#095899'
				},
				arrow: {
					color: '#EBF0F5'
				}
			}
		},
		MuiList: {
			styleOverrides: {
				root: {
					backgroundColor: '#f4fafd',
					'&::-webkit-scrollbar-track': {
						backgroundColor: '#091e4214',
						borderRadius: '4px'
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'transparent',
						width: '80%',
						borderRadius: '4px'
					},
					'&::-webkit-scrollbar-button': {
						display: 'block',
						height: '4px',
						width: '24px'
					}
				}
			}
		},
		MuiAutocomplete: {
			styleOverrides: {
				paper: {
					backgroundColor: '#f4fafd',
					'&::-webkit-scrollbar-track': {
						backgroundColor: '#091e4214',
						borderRadius: '4px'
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'transparent',
						width: '80%',
						borderRadius: '4px'
					},
					'&::-webkit-scrollbar-button': {
						display: 'block',
						height: '4px',
						width: '24px'
					}
				}
			}
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					'& option': {
						backgroundColor: '#f4fafd !important',
						'&:hover': {
							backgroundColor: '#f4fafd !important'
						}
					}
				}
			}
		}
	},
	typography: typograhpy
});

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			dark: '#095899',
			main: '#90CAF9',
			light: '#42A5F5'
		},
		secondary: {
			main: '#90CAF9',
			light: '#FFD896'
		},
		error: {
			main: '#FFA0A0'
		}
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: '#353535',
					borderRadius: '10px'
				},
				arrow: {
					color: '#353535'
				}
			}
		}
	},
	typography: typograhpy
});
