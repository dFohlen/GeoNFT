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
        // MuiCssBaseline: {
        //     styleOverrides: {
        //         body: {
        //             backgroundImage:
        //                 'radial-gradient(circle farthest-corner at top left, rgba(0, 0, 0, 0.10) 0%, rgba(0, 155, 150, 0.5) 50%),\n' +
        //                 'radial-gradient(circle farthest-corner at bottom right, rgba(225, 183, 82, 1) 0%, rgba(0, 0, 0, 0.5) 50%)',
        //             backgroundAttachment: 'fixed',
        //         },
        //     },
        // },
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
