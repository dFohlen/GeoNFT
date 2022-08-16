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
import { Box } from '@material-ui/core';
import Navbar from './components/Navbar';
import { GoogleMap } from './components/GoogleMap';

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
            {(!wallet.publicKey || !wallet.connected || !anchorWallet?.publicKey) && (
                <Box alignItems="center" justifyContent="center" minHeight="100vh">
                    <WalletMultiButton />
                </Box>
            )}
            {/* {!wallet.publicKey || !wallet.connected || !anchorWallet?.publicKey ? (
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                    <WalletMultiButton />
                </Box>
            ) : (
                <Box style={{ height: '100vh', width: '100%' }} alignItems="center" justifyContent="center">
                    <GoogleMap  />
                </Box>
            )} */}
            <Box style={{ height: '100vh', width: '100%' }} alignItems="center" justifyContent="center">
                <Navbar />
            </Box>
        </>
    );
};
