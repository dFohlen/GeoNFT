import React, { useCallback, useEffect, useState } from 'react';

import { Grid, Box, Typography, ListItemAvatar } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { getParsedTokenAccountsByOwner, getMetadataByTokenAccounts } from '../api/getNFTs';
import { createGeocache } from '../api/createGeocache';
import { truncateAddress } from '../utils/truncateAddress';
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

        await nfts
            ?.filter((nft: any) => nft.pubkey.toString() === chosenPubkey)
            .forEach(async (nft: any) => {
                console.log('Create: ', chosenPubkey);
                await createGeocache(
                    program,
                    nft.pubkey,
                    (nft.account.data as ParsedAccountData).parsed.info.mint,
                    location
                );
                enqueueSnackbar('Geocache created', { variant: 'success' });
                if (nfts) {
                    setNfts(nfts.filter((n: any) => n.pubkey !== nft.pubkey));
                }
            });
    };

    return (
        <>
            <Grid item xs={12}>
                {!nfts ? (
                    <Typography>Loading NFTs...</Typography>
                ) : nfts.length === 0 ? (
                    <Typography>No NFTs found</Typography>
                ) : (
                    <>
                        <Typography>Choose a NFT to create a geocache</Typography>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} dense={true}>
                            {nfts.map((item: any) => (
                                <>
                                    <ListItem key={item.pubkey} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <img src={'path'} />
                                        </ListItemAvatar>
                                        <ListItemButton
                                            key={item.pubkey}
                                            onClick={() => newGeocache(item.pubkey.toString())}
                                        >
                                            <ListItemText primary={truncateAddress(item.pubkey.toString())} />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                </>
                            ))}
                        </List>
                    </>
                )}
            </Grid>
        </>
    );
}
