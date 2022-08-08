import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
// import {IDL, NftGeocaching} from '@nft-geocaching/anchor/target/types/nft_geocaching'
import idl from '@nft-geocaching/anchor/target/idl/nft_geocaching.json';

// export async function createGeocache(connection: Connection, wallet: AnchorWallet): Promise<anchor.IdlTypes<NftGeocaching>> {
export async function createGeocache(connection: Connection, wallet: AnchorWallet): Promise<any> {
    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
    const programID = new PublicKey(idl.metadata.address);
    const program = new anchor.Program(idl as anchor.Idl, programID, provider);
    console.log(program);
    const account = anchor.web3.Keypair.generate();

    const transaction = await program.methods.create().rpc;
    await program.rpc.create({
        accounts: {
            geocache: account.publicKey,
            player: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [account],
    });
    console.log('Transaction signature', transaction);

    const geocache = await program.account.geocache.fetch(account.publicKey);
    console.log('Geocache', geocache);
    return account;
}
