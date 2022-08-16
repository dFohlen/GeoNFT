import React, { useState } from 'react';
import { Grid, BottomNavigation, BottomNavigationAction, Box } from '@material-ui/core';
import { useWallet } from '@solana/wallet-adapter-react';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import NavigationIcon from '@mui/icons-material/Navigation';
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
                <Box style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue: string) => {
                            console.log('setting value to ' + newValue);
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction
                            label="Collectables"
                            value="collectables"
                            icon={<AccountBalanceWallet />}
                        />
                        <BottomNavigationAction label="Map" value="map" icon={<Map />} />
                    </BottomNavigation>
                </Box>
            </Grid>
        </>
    );
}
