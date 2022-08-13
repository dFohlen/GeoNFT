import React from 'react';
import { useWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { IDL, NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';
import idl from '@nft-geocaching/anchor/target/idl/nft_geocaching.json';

export function useAnchor(): anchor.Program<any> {
    const { connection } = useConnection();
    const wallet = useWallet();
    if (!wallet?.publicKey) throw new Error('Wallet not ready');
    const anchorWallet = useAnchorWallet();
    if (!anchorWallet?.publicKey) throw new Error('Connect to Phantom first');
    const provider = new anchor.AnchorProvider(connection, anchorWallet, { preflightCommitment: 'processed' });
    const programID = new anchor.web3.PublicKey(idl.metadata.address);
    // const program = new anchor.Program<NftGeocaching>(IDL, programID, provider);
    const program = new anchor.Program(idl as anchor.Idl, programID, provider);
    return program;
}
