import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@material-ui/core';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Map from '@mui/icons-material/Map';

export default function Navbar() {
    const navigate = useNavigate();
    const [value, setValue] = useState('map');

    return (
        <>
            <Paper style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={2}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue: string) => {
                        setValue(newValue);
                        // navigate(newValue);
                    }}
                >
                    <BottomNavigationAction label="Collectables" value="collectables" icon={<AccountBalanceWallet />} />
                    <BottomNavigationAction label="Map" value="map" icon={<Map />} />
                </BottomNavigation>
            </Paper>
        </>
    );
}
