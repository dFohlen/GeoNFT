import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getNFTs } from '../api/getNFTs';
import React, { FC, useCallback } from 'react';
import { createGeocache } from '../api/createGeocache';
import { useGeolocationPosition } from '../hooks/useGeolocationPosition';
import { setGeocacheLocation } from '../api/setGeocacheLocation';

export default function Collectables() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useAnchorWallet();
    const location = useGeolocationPosition();

    const onClick = useCallback(async () => {
        if (!publicKey || !wallet) {
            throw new WalletNotConnectedError();
        }

        if (!location) {
            throw new Error('No location');
        }

        const nfts = await getNFTs(connection, publicKey);
        console.log(nfts);
        const account = await createGeocache(connection, wallet);
        const geocache = await setGeocacheLocation(connection, wallet, account, location);
        console.log(geocache);
    }, [publicKey, connection, wallet, location]);

    return (
        <>
            { !location ? (
                <div>
                    <p>Loading location...</p>
                </div>
            ) : (
                <button onClick={onClick} disabled={!publicKey}>
                    Create Geocache!
                </button>
            )}
        </>
    );
}
