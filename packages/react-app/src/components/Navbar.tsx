import React, { useState } from 'react';
import { Grid, BottomNavigation, BottomNavigationAction, Box } from '@material-ui/core';
import { useWallet } from '@solana/wallet-adapter-react';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Map from '@mui/icons-material/Map';
import Geocaches from './Geocaches';
import Collectables from './Collectables';

export default function Navbar() {
    const { publicKey } = useWallet();
    const [value, setValue] = useState('map');

    return (
        <>
            <Grid item xs={12}>
                {publicKey && value == 'map' && <Geocaches />}
                {publicKey && value == 'collectables' && <Collectables />}
            </Grid>
            <Grid item xs={12}>
                <BottomNavigation
                    showLabels
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'transparent',
                        boxShadow: '0px 3px 10px rgba(0, 0, 0, 1)',
                    }}
                    value={value}
                    onChange={(event, newValue: string) => {
                        console.log('setting value to ' + newValue);
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction
                        // style={{ color: '#d33265' }}
                        // label="Collectables"
                        value="collectables"
                        icon={<AccountBalanceWallet fontSize="large" style={{ color: '#d33265' }} />}
                    />
                    <BottomNavigationAction
                        // style={{ color: '#d33265' }}
                        // label="Map"
                        value="map"
                        icon={<Map fontSize="large" style={{ color: '#d33265' }} />}
                    />
                </BottomNavigation>
            </Grid>
        </>
    );
}
