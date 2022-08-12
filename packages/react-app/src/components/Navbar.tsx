import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@material-ui/core';
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
            {publicKey && value == 'map' && <Geocaches />}
            {publicKey && value == 'collectables' && <Collectables />}
            <Paper style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={2}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue: string) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="Collectables" value="collectables" icon={<AccountBalanceWallet />} />
                    <BottomNavigationAction label="Map" value="map" icon={<Map />} />
                </BottomNavigation>
            </Paper>
        </>
    );
}
