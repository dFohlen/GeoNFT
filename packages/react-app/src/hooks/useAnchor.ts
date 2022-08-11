import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import {IDL, NftGeocaching} from '@nft-geocaching/anchor/target/types/nft_geocaching'
import idl from '@nft-geocaching/anchor/target/idl/nft_geocaching.json';

export function useAnchor(): anchor.Program<any> {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    if (!wallet) {
        throw new WalletNotConnectedError();
    }

    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    const programID = new anchor.web3.PublicKey(idl.metadata.address);
    // const program = new anchor.Program<NftGeocaching>(IDL, programID, provider);
    const program = new anchor.Program(idl as anchor.Idl, programID, provider);
    return program;
}
