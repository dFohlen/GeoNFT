import { PublicKey, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function getNFTs(connection: Connection, publicKey: PublicKey): Promise<void> {
    console.log(`Sending transaction... ${TOKEN_PROGRAM_ID}`);
    const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
            {
                dataSize: 165, // number of bytes
            },
            {
                memcmp: {
                    offset: 32, // number of bytes
                    bytes: publicKey.toBase58(), // base58 encoded string
                },
            },
        ],
    });

    console.log(accounts);
    console.log(`Found ${accounts.length} token account(s) for wallet ${publicKey}`);

    // Fetch each nft from the token program
    let totalNFTsI = 0;
    const tokensInWallet: any = [];
    await accounts.forEach((account: any, i) => {
        // account.account.data;
        const amountI = account.account.data['parsed']['info']['tokenAmount']['uiAmount'];
        const mint_s = account.account.data['parsed']['info']['mint'];

        totalNFTsI += 1;

        try {
            console.log(`-- Token Account Address ${i + 1}: ${account.pubkey.toString()} --`);
            console.log(`Mint: ${mint_s}`);
            const objT: any = {};
            objT.mint = mint_s;
            objT.amount = amountI;
            tokensInWallet.push(objT);

            // let token_amount_i = account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"]
            console.log(`Amount: ${amountI}`);
        } catch {
            //tokensInWallet.push({mint:mint_s,amount: amountI })
        }
    });

    // console.log("total NFTs: {}", totalNFTsI);
    return tokensInWallet;
}
