import React, { useEffect, useState } from 'react';
import { useAnchor } from '../hooks/useAnchor';
import { getGeocaches } from '../api/getGeocaches';
import { ProgramAccount } from '@project-serum/anchor';
import { GeocachesList } from './GeocachesList';
import { useGeolocationPosition, distanceInKmBetweenEarthCoordinates } from '../hooks/useGeolocationPosition';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';
import { Typography } from '@mui/material';

export default function Geocaches() {
    const location = useGeolocationPosition();
    const program = useAnchor();
    const [geocaches, setGeocaches] = useState<ProgramAccount<NftGeocaching>[]>();

    useEffect(() => {
        // declare the data fetching function
        if (!geocaches && location) {
            const fetchData = async () => {
                const rawGeocaches = await getGeocaches(program);
                console.log(rawGeocaches);
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

    return (
        <>
            {!geocaches ? (
                <Typography>Loading geocaches...</Typography>
            ) : geocaches.length === 0 ? (
                <Typography>No geocaches</Typography>
            ) : (
                <GeocachesList geocaches={geocaches}></GeocachesList>
            )}
        </>
    );
}
