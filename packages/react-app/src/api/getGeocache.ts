import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function getGeocaches(
    program: anchor.Program<NftGeocaching>,
    geocacheAccount: PublicKey,
    mint: PublicKey
): Promise<any> {
    try {
        const seeker = anchor.web3.Keypair.generate();

        // Vault PDA
        const [vaultAddress, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
            [geocacheAccount.toBytes()],
            program.programId
        );
        console.log('Vault PDA: ' + vaultAddress.toString());
        console.log('Vault bump: ' + vaultBump.toString());

        const seekerAccount = await getOrCreateAssociatedTokenAccount(
            program.provider.connection,
            seeker,
            mint,
            (program.provider as anchor.AnchorProvider).wallet.publicKey
        );

        console.log('Seeker account: ' + seekerAccount);

        const tx = await program.methods
            .getGeocache(vaultBump)
            .accounts({
                geocache: geocacheAccount,
                tokenAccount: vaultAddress,
                seekerTokenAccount: seekerAccount.address,
                seeker: seeker.publicKey,
                mint: mint,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .signers([seeker])
            .rpc();
        console.log('Transaction signature', tx);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}
