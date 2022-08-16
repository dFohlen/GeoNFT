import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function getGeocaches(
    program: anchor.Program<NftGeocaching>,
    geocacheAccount: PublicKey,
    mint: PublicKey
): Promise<any> {
    const newTokenA = anchor.web3.Keypair.generate();

    // Vault PDA
    const [vaultAddress, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
        [geocacheAccount.toBytes()],
        program.programId
    );
    console.log('Vault PDA: ' + vaultAddress.toString());
    console.log('Vault bump: ' + vaultBump.toString());

    const seekerAccount = await getOrCreateAssociatedTokenAccount(
        program.provider.connection,
        newTokenA,
        mint,
        (program.provider as anchor.AnchorProvider).wallet.publicKey
    );

    const tx = await program.methods
        .getGeocache(vaultBump)
        .accounts({
            geocache: geocacheAccount,
            tokenAccount: vaultAddress,
            seekerTokenAccount: seekerAccount.address,
            seeker: (program.provider as anchor.AnchorProvider).wallet.publicKey,
            mint: mint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([newTokenA])
        .rpc();
    console.log('Transaction signature', tx);
}
