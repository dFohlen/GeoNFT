import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

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
