import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { getParsedTokenAccountsByOwner, getMetadataByTokenAccounts } from '../api/getNFTs';
import { createGeocache } from '../api/createGeocache';
import { useGeolocationPosition } from '../hooks/useGeolocationPosition';
import { ParsedAccountData } from '@solana/web3.js';
import { useAnchor } from '../hooks/useAnchor';
import { useSnackbar } from 'notistack';

export default function Collectables() {
    const { enqueueSnackbar } = useSnackbar();
    const [nfts, setNfts] = useState<any[]>();
    const program = useAnchor();
    const location = useGeolocationPosition();

    useEffect(() => {
        if (!nfts && location) {
            const fetchData = async () => {
                const accounts = await getParsedTokenAccountsByOwner(program);
                setNfts(accounts);
            };

            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }
    }, [location, program, nfts]);

    const newGeocache = async (chosenPubkey: any) => {
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

        for (let i=0; i<accounts.length; i++) {
            if (chosenPubkey == accounts[i].pubkey.toString()) {
                // const metadata = await getMetadataByTokenAccounts(accounts);
                // console.log(metadata);
                // const geocache = await setGeocacheLocation(connection, wallet, account, location);

                const geocache = await createGeocache(
                    program,
                    accounts[i].pubkey,
                    (accounts[0].account.data as ParsedAccountData).parsed.info.mint,
                    location
                );
                console.log('Create: ', chosenPubkey);
            }
        }
    }

    return (
        <>
            {!location ? (
                <div>
                    <p>Loading location...</p>
                </div>
            ) : !nfts || nfts.length === 0 ? (
                <div>
                    <p>No NFTs found</p>
                </div>
            ) : (
                <div>
                    <Box m={2}>
                        <p>Choose a NFT to create a Geocache</p>
                        <List dense={true} sx={{ width: '100%', maxWidth: 360 }}>
                            {nfts.map((item: any) => (
                                <ListItemButton
                                    key={item.pubkey}
                                    divider={true}
                                    onClick={() => newGeocache(item.pubkey.toString())}
                                >
                                    <img
                                        src={"path"}
                                        alt={"nft"}
                                    />
                                    <ListItemText primary={item.pubkey.toString()}/>
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </div>
            )}
        </>
    );
}