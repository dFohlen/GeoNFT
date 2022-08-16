import * as React from 'react';
import { Box, Link, List, ListItemText, IconButton } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Navigation from '@mui/icons-material/Navigation';
import { getGeocaches } from '../api/getGeocache';
import { useAnchor } from '../hooks/useAnchor';

interface GeocachesProps {
    geocaches: any[];
}

export const GeocachesList = (props: GeocachesProps) => {
    const program = useAnchor();

    const onClick = async (geocache: any) => {
        console.log('Catch geocache: ', geocache);
        await getGeocaches(program, geocache.pubkey, geocache.account.mint);
    };

    return (
        <>
            <List dense={true}>
                {props.geocaches.map((geocache: any) => (
                    <ListItem key={geocache.publicKey.toString()}>
                        <ListItemText
                            primary={geocache.publicKey.toString()}
                            secondary={
                                geocache.distance < 1
                                    ? `${(geocache.distance * 100).toFixed(2)} m`
                                    : `${geocache.distance.toFixed(2)} km`
                            }
                        />
                        {geocache.distance < 0.5 ? (
                            <ListItemButton divider={true} onClick={() => onClick(geocache)}>
                                <AddShoppingCartIcon />
                            </ListItemButton>
                        ) : (
                            <Link href={`http://maps.google.com/maps?q=${geocache.account.location}`}>
                                <Navigation />
                            </Link>
                        )}
                    </ListItem>
                ))}
            </List>
        </>
    );
};
