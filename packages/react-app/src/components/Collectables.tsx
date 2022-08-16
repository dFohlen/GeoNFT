import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
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

        nfts?.filter((nft: any) => nft.pubkey.toString() === chosenPubkey).forEach(async (nft: any) => {
            const geocache = await createGeocache(
                program,
                nft.pubkey,
                (nft.account.data as ParsedAccountData).parsed.info.mint,
                location
            );
            console.log('Create: ', chosenPubkey);
        });
    };

    return (
        <>
           {!nfts ? (
                <Typography>Loading NFTs...</Typography>
            ) : nfts.length === 0 ? (
                <Typography>No NFTs found</Typography>
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
                                <img src={'path'} alt={'nft'} />
                                <ListItemText primary={item.pubkey.toString()} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </div>
            )}
        </>
    );
}
