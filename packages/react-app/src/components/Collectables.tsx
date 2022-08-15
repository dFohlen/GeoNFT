import React, { useCallback, useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
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
    const [nfts, setNfts] = useState<ParsedAccountData[]>();
    const program = useAnchor();
    const location = useGeolocationPosition();
    let nftsList:any;

    useEffect(() => {
        if (!nfts && location) {
            const fetchData = async () => {
                const accounts = await getParsedTokenAccountsByOwner(program);
                console.log('Token accounts: ');
                console.log(accounts);

                nftsList = [accounts.length];

                for(let i=0; i<accounts.length; i++){
                    console.log(i);
                    console.log(accounts[i].pubkey.toString());
                    nftsList[i] = accounts[i];
                }
/*
                const nftList = accounts.map((nft: ParsedAccountData) => {
                    const nftPubKey = nft.account.pubkey.toString;
                    return{
                        nft
                    };
                })*/
            };

            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }
    }, [location, program, nfts]);

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
                <div>
                    <p>Choose a NFT to create a Geocache</p>
                    {nftsList?.map((nft:any) => (
                        <ListItem
                            key={nft.pubKey.toString()}
                        >
                            <ListItemText
                                primary="test"
                            />
                        </ListItem>
                    ))}
                </div>
            )}
        </>
    );
}

