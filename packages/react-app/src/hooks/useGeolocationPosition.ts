import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function distanceInKmBetweenEarthCoordinates(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
) {
    const earthRadiusKm = 6371;
    const lat = degreesToRadians(latitude2 - latitude1);
    const long = degreesToRadians(longitude2 - longitude1);
    const a =
        Math.sin(lat / 2) * Math.sin(lat / 2) +
        Math.sin(long / 2) *
            Math.sin(long / 2) *
            Math.cos(degreesToRadians(latitude1)) *
            Math.cos(degreesToRadians(latitude2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earthRadiusKm * c;
    return d;
}

export function useGeolocationPosition() {
    const [geolocationPosition, setGeolocationPosition] = useState<GeolocationPosition>();
    const { enqueueSnackbar } = useSnackbar();

    function getGeolocationPosition() {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        function success(position: GeolocationPosition) {
            console.log('Your current position is:');
            console.log(`Latitude : ${position.coords.latitude}`);
            console.log(`Longitude: ${position.coords.longitude}`);
            console.log(`More or less ${position.coords.accuracy} meters.`);
            setGeolocationPosition(position);
        }

        function error(error: GeolocationPositionError) {
            console.warn(`Geolocation error: (${error.code}): ${error.message}`);
            enqueueSnackbar(`Geolocation error: (${error.code}): ${error.message}`, { variant: 'error' });
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    useEffect(() => {
        if (!geolocationPosition) {
            getGeolocationPosition();
        }
    }),
        [geolocationPosition];
    return geolocationPosition;
}
