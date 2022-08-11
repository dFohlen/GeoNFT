import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function createGeocache(
    program: anchor.Program<NftGeocaching>,
    hiderTokenAccount: PublicKey,
    mint: PublicKey,
    location: GeolocationPosition
) {
    const newGeocache = anchor.web3.Keypair.generate();

    // Vault PDA
    const [vaultAddress, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
        [newGeocache.publicKey.toBytes()],
        program.programId
    );

    console.log('Vault PDA', vaultAddress.toString());
    console.log('Vault bump', vaultBump.toString());

    const hiderAccount = await getAccount(program.provider.connection, hiderTokenAccount);

    console.log('Hider Account', hiderAccount);

    if (hiderAccount.amount < 1) {
        throw new Error('Hider account does not have enough tokens');
    }

    const tx = await program.methods
        .createGeocache(vaultBump, location.coords.latitude + ',' + location.coords.longitude)
        .accounts({
            geocache: newGeocache.publicKey,
            tokenAccount: vaultAddress,
            hiderTokenAccount: hiderTokenAccount,
            hider: (program.provider as anchor.AnchorProvider).wallet.publicKey,
            mint: mint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([newGeocache])
        .rpc();
    console.log('Transaction signature', tx);

    const geocache = await program.account.geocache.fetch(newGeocache.publicKey);
    console.log('Geocache', geocache);
}
