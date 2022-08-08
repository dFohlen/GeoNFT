import React, { useEffect, useState } from 'react';

export function useGeolocationPosition() {
    const [geolocationPosition, setGeolocationPosition] = useState<GeolocationPosition>();

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
            console.warn(`ERROR(${error.code}): ${error.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    useEffect(() => {
        getGeolocationPosition();
    }, []);
    return geolocationPosition;
}
