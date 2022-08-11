import * as anchor from '@project-serum/anchor';
import { PublicKey, Connection, AccountInfo, ParsedAccountData, Signer } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID, createMint, mintTo, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { IDL, NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function requestAirdrop(connection: Connection) {
    console.log('Requesting airdrop');

    const payer = anchor.web3.Keypair.generate();

    await connection.confirmTransaction(await connection.requestAirdrop(payer.publicKey, 1000000000), 'confirmed');

    // Create mint of token
    const mint = await createMint(connection, payer, payer.publicKey, null, 0);

    // Get or create token accounts
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);

    // Mint to the token account
    await mintTo(connection, payer, mint, tokenAccount.address, payer.publicKey, 1);

    console.log('mint', mint.toString());
}

export async function getTokenAccountsByOwner(program: anchor.Program<NftGeocaching>): Promise<
    Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }>
> {
    console.log(`Sending transaction... ${TOKEN_PROGRAM_ID}`);
    // const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
    const accounts = await program.provider.connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
            {
                dataSize: 165, // number of bytes
            },
            {
                memcmp: {
                    offset: 32, // number of bytes
                    bytes: program.provider.publicKey!.toBase58(), // base58 encoded string
                },
            },
        ],
    });

    console.log(accounts);
    console.log(`Found ${accounts.length} token account(s) for wallet ${program.provider.publicKey}`);
    return accounts;
}

export async function getParsedTokenAccountsByOwner(program: anchor.Program<NftGeocaching>): Promise<
    Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData>;
    }>
> {
    // await requestAirdrop(connection);
    console.log('Requesting token accounts...');
    // const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
    let accounts = await program.provider.connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
            {
                dataSize: 165, // number of bytes
            },
            {
                memcmp: {
                    offset: 32, // number of bytes
                    bytes: program.provider.publicKey!.toBase58(), // base58 encoded string
                },
            },
        ],
    });

    accounts = accounts
        .filter(({ account }) => {
            if ((account.data as ParsedAccountData).parsed.info.tokenAmount.uiAmount === 1) return true;
            return false;
        })
        .map(({ pubkey, account }) => ({ pubkey, account }));

    console.log(`Found ${accounts.length} token account(s) with 1 token for wallet ${program.provider.publicKey}`);

    return accounts;
}

export async function getMetadataByTokenAccounts(
    tokenAccounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer>;
    }>
): Promise<void> {
    for (const tokenAccount of tokenAccounts) {
        try {
            const metadata = await Metadata.fromAccountInfo(tokenAccount.account);
            console.log(metadata);
        } catch (e) {
            console.log(e);
        }
    }
}
