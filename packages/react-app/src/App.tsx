import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    CoinbaseWalletAdapter,
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { Theme } from './Theme';
import { useSnackbar } from 'notistack';
import { Grid } from '@material-ui/core';
import Navbar from './components/Navbar';
import Header from './components/Header';
import { Typography } from '@mui/material';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <Theme>
            <Context>
                <Content />
            </Context>
        </Theme>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Select the wallets you wish to support, by instantiating wallet adapters here.
             *
             * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
             * That package supports tree shaking and lazy loading -- only the wallets you import
             * will be compiled into your application, and only the dependencies of wallets that
             * your users connect to will be loaded.
             */
            new CoinbaseWalletAdapter(),
            new GlowWalletAdapter({ network }),
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
            new SolletWalletAdapter({ network }),
            new TorusWalletAdapter({ params: { network } }),
        ],
        [network]
    );

    const { enqueueSnackbar } = useSnackbar();
    const onError = useCallback(
        (error: WalletError) => {
            enqueueSnackbar(error.message ? `${error.name}: ${error.message}` : error.name, { variant: 'error' });
            console.error(error);
        },
        [enqueueSnackbar]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();

    return (
        <>
            <Header />
            <Grid
                container
                spacing={5}
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={6}>
                    {(!wallet.publicKey || !wallet.connected || !anchorWallet?.publicKey) && (
                        <>
                            <Typography variant="h3" align="center" color={'lightgray'}>
                                Welcome to GeoNFT!
                            </Typography>
                            <Typography marginTop={3} align="center" color={'lightgray'}>
                                GeoNFT is an outdoor activity game in which participants use a Global Positioning System
                                (GPS) to search for Non-Fungible Tokens (NFTs) around the world.
                            </Typography>
                            <Typography marginTop={3} align="center" color={'lightgray'}>
                                Connect your Solana compatible wallet and let the hunt begin!
                            </Typography>
                        </>
                    )}
                </Grid>
                <Grid item>
                    <Navbar />
                </Grid>
            </Grid>
        </>
    );
};
