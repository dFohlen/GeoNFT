import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { blue, deepPurple } from '@mui/material/colors';
import { SnackbarProvider } from 'notistack';
import React, { FC, ReactNode } from 'react';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#35D07F',
            main: '#009B96',
            dark: '#007088',
            contrastText: '#fff',
        },
        secondary: {
            light: '#FFDA69',
            main: '#FBCC5C',
            dark: '#E1B752',
            contrastText: '#000000',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0f0e13',
                    backgroundImage:
                        'radial-gradient(at 0% 0%,  hsla(225,39%,20%,1) 0, transparent 50%),\n' +
                        'radial-gradient(at 50% 0%, hsla(253,16%,7%,1) 0, transparent 50%),\n' +
                        'radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%),\n' +
                        'radial-gradient(at 0% 50%, hsla(339,49%,10%,1) 0, transparent 50%),\n' +
                        'radial-gradient(at 100% 50%, hsla(225,39%,20%,1) 0, transparent 50%),\n' +
                        'radial-gradient(at 0% 100%, hsla(255,65%,15%,1)0, transparent 50%),\n' +
                        'radial-gradient(at 100% 100%, hsla(255,65%,15%,1)0, transparent 50%),\n' +
                        'radial-gradient(at 50% 100%, hsla(339,49%,10%,1) 0, transparent 50%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    color: deepPurple[500],
                },
            },
        },
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    color: deepPurple[500],
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    justifyContent: 'flex-start',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    padding: '12px 16px',
                },
                startIcon: {
                    marginRight: 8,
                },
                endIcon: {
                    marginLeft: 8,
                },
            },
        },
    },
});

export const Theme: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </CssBaseline>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};
