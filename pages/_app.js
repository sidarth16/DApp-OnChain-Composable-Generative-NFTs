import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

import '@rainbow-me/rainbowkit/styles.css';
import { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect } from "react";

// require("dotenv").config();
// const { ALCHEMY_API_KEY } = process.env;

const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.mainnet,
    // chain.polygon,
    chain.polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.polygonMumbai]
      : []),
  ],
  [
    alchemyProvider({ apiKey: 'Hq62Xzx-iE-sYugUEpk2Auaz3qUHiGz9' }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});



function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;