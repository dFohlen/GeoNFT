import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getNFTs } from '../api/getNFTs';
import React, { FC, useCallback } from 'react';
import { createGeocache } from '../api/createGeocache';

export default function Collectables() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useAnchorWallet();

    const onClick = useCallback(async () => {
        if (!publicKey || !wallet) {
            throw new WalletNotConnectedError();
        }

        const nfts = await getNFTs(connection, publicKey);
        console.log(nfts);
        const geocache = await createGeocache(connection, wallet);
        console.log(geocache);
    }, [publicKey, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Send 1 lamport to a random address!
        </button>
    );
}
