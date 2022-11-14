import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Logo from './../assets/logo.png';

export default function ButtonAppBar() {
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" style={{ background: 'transparent' }}>
                <Toolbar>
                    <Box
                        component="img"
                        sx={{
                            height: 50,
                        }}
                        alt="GeoNFT"
                        src={Logo}
                    />
                    <Typography variant="h5" component="div" color={'#d33265'} fontWeight={'bold'} sx={{ flexGrow: 1 }}>
                        GeoNFT
                    </Typography>
                    <WalletMultiButton style={{ height: 35, borderRadius: 35, backgroundColor: '#d33265' }} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
