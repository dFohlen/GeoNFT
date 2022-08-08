import React, { useEffect, useState } from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
// import {IDL, NftGeocaching} from '@nft-geocaching/anchor/target/types/nft_geocaching'
import idl from '@nft-geocaching/anchor/target/idl/nft_geocaching.json';
import { useGeolocationPosition } from '../hooks/useGeolocationPosition';

export async function setGeocacheLocation(
    connection: Connection,
    wallet: AnchorWallet,
    account: anchor.web3.Keypair,
    geolocationPosition: GeolocationPosition
) {
    const locationString =
        geolocationPosition.coords.latitude.toString() + ',' + geolocationPosition.coords.longitude.toString();
    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    const programID = new PublicKey(idl.metadata.address);
    const program = new anchor.Program(idl as anchor.Idl, programID, provider);
    console.log(program);

    const transaction = await program.rpc.setGeocache(locationString, {
        accounts: {
            geocache: account.publicKey,
            player: wallet.publicKey,
        },
    });
    console.log('Transaction signature', transaction);

    const geocache = await program.account.geocache.fetch(account.publicKey);
    console.log('Geocache', geocache);
    return geocache;
}
