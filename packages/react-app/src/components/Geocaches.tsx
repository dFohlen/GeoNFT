import React, { useEffect, useState } from 'react';
import { useAnchor } from '../hooks/useAnchor';
import { useSnackbar } from 'notistack';
import { listGeocaches } from '../api/listGeocaches';
import { getGeocaches as getGeocache } from '../api/getGeocache';
import { truncateAddress } from '../utils/truncateAddress';
import { ProgramAccount } from '@project-serum/anchor';
import { useGeolocationPosition, distanceInKmBetweenEarthCoordinates } from '../hooks/useGeolocationPosition';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';
import { Box, IconButton, Link, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Navigation from '@mui/icons-material/Navigation';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function Geocaches() {
    const { enqueueSnackbar } = useSnackbar();
    const location = useGeolocationPosition();
    const program = useAnchor();
    const [geocaches, setGeocaches] = useState<ProgramAccount<NftGeocaching>[]>();

    useEffect(() => {
        // declare the data fetching function
        if (!geocaches && location) {
            const fetchData = async () => {
                const rawGeocaches = await listGeocaches(program);
                if (!rawGeocaches) {
                    setGeocaches([]);
                    return;
                }
                const geocachesWithDistance = rawGeocaches
                    .map((geocache: any) => {
                        const coordinates = geocache.account.location.split(',');
                        return {
                            ...geocache,
                            distance: distanceInKmBetweenEarthCoordinates(
                                location.coords.latitude,
                                location.coords.longitude,
                                coordinates[0],
                                coordinates[1]
                            ),
                        };
                    })
                    .sort((a: any, b: any) => a.distance - b.distance);
                setGeocaches(geocachesWithDistance);
            };

            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }
    }, [location, program, geocaches]);

    const onClick = async (geocache: any) => {
        console.log('Catch geocache: ', geocache);
        await getGeocache(program, geocache.publicKey, geocache.account.mint);
        enqueueSnackbar('Geocache successfully caught', { variant: 'success' });
        if (geocaches) {
            setGeocaches(geocaches.filter((g: any) => g.publicKey !== geocache.publicKey));
        }
    };

    return (
        <>
            {!geocaches ? (
                <Typography variant="h5" color={'white'}>
                    Loading geocaches...
                </Typography>
            ) : geocaches.length === 0 ? (
                <Typography variant="h5" color={'white'}>
                    No geocaches
                </Typography>
            ) : (
                <>
                    <Typography align="center" variant="h5" color={'white'}>
                        Catch or navigate to a geocache
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} dense={true}>
                            {geocaches.map((geocache: any) => (
                                <>
                                    <Divider sx={{ bgcolor: 'gray' }} />
                                    <ListItem
                                        key={geocache.publicKey.toString()}
                                        secondaryAction={
                                            geocache.distance < 0.5 ? (
                                                <IconButton onClick={() => onClick(geocache)}>
                                                    <AddShoppingCartIcon />
                                                </IconButton>
                                            ) : (
                                                <Link
                                                    target="_blank"
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${geocache.account.location}`}
                                                >
                                                    <IconButton>
                                                        <Navigation />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }
                                    >
                                        <ListItemText
                                            primaryTypographyProps={{ style: { color: 'white' } }}
                                            primary={truncateAddress(geocache.publicKey.toString())}
                                            secondary={
                                                geocache.distance < 1
                                                    ? `${(geocache.distance * 100).toFixed(2)} m`
                                                    : `${geocache.distance.toFixed(2)} km`
                                            }
                                        />
                                    </ListItem>
                                </>
                            ))}
                        </List>
                    </Box>
                </>
            )}
        </>
    );
}

// geocache.distance < /> 0.5 ? (
// <ListItemButton onClick={() => onClick(geocache)}>
//     <AddShoppingCartIcon />
// </ListItemButton>
// ) : (
//     <Link />
//         target="_bank"
//         href={`http://maps.google.com/maps?q=${geocache.account.location}`}
//     >
//         <Navigation />
//     </Link>
// )
