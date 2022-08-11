import React, { useCallback, useEffect, useState } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { getParsedTokenAccountsByOwner, getMetadataByTokenAccounts } from '../api/getNFTs';
import { createGeocache } from '../api/createGeocache';
import { useGeolocationPosition } from '../hooks/useGeolocationPosition';
import { ParsedAccountData } from '@solana/web3.js';
import { useAnchor } from '../hooks/useAnchor';
import { useSnackbar } from 'notistack';

export default function Collectables() {
    const { enqueueSnackbar } = useSnackbar();
    const [nfts, setNfts] = useState<ParsedAccountData[]>();
    const program = useAnchor();
    const location = useGeolocationPosition();

    const onClick = useCallback(async () => {
        if (!program.provider.publicKey) {
            throw new WalletNotConnectedError();
        }

        if (!location) {
            throw new Error('No location');
        }

        const accounts = await getParsedTokenAccountsByOwner(program);
        console.log(accounts);

        if (accounts.length === 0) {
            enqueueSnackbar('No accounts', { variant: 'error' });
        }

        // const metadata = await getMetadataByTokenAccounts(accounts);
        // console.log(metadata);
        const geocache = await createGeocache(
            program,
            accounts[0].pubkey,
            (accounts[0].account.data as ParsedAccountData).parsed.info.mint,
            location
        );
        // const geocache = await setGeocacheLocation(connection, wallet, account, location);
        console.log(geocache);
    }, [program, location, enqueueSnackbar]);

    return (
        <>
            {!location ? (
                <div>
                    <p>Loading location...</p>
                </div>
            ) : (
                <button onClick={onClick} disabled={!program.provider.publicKey}>
                    Create Geocache!
                </button>
            )}
        </>
    );
}
