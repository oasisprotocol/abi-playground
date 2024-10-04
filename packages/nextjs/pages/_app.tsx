import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlausibleProvider from "next-plausible";
import { ThemeProvider, useTheme } from "next-themes";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { getStoredChainsFromLocalStorage } from "~~/components/NetworksDropdown/utils";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import "~~/styles/globals.css";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const { addChain, setNativeCurrencyPrice } = useGlobalState(state => ({
    addChain: state.addChain,
    setNativeCurrencyPrice: state.setNativeCurrencyPrice,
  }));
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedCustomChains = getStoredChainsFromLocalStorage();

    storedCustomChains.forEach(chain => {
      addChain(chain);
    });
  }, [addChain]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <RainbowKitProvider
      avatar={BlockieAvatar}
      theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
    >
      <div className="flex min-h-screen flex-col">
        <main className="relative flex flex-1 flex-col">
          <div role="alert" className="bg-error">
            {/* Heroicons: exclamation-triangle; License: MIT */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current inline h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Warning: Interacting with contracts directly is risky. Be careful and use it as a last resort and with
              small values.
            </span>
          </div>
          <Component {...pageProps} />
        </main>
      </div>
      <Toaster />
    </RainbowKitProvider>
  );
};

const ScaffoldEthAppWithProviders = (props: AppProps) => {
  const wagmiConfig = useGlobalState(state => state.wagmiConfig);

  return (
    <PlausibleProvider domain="abi.ninja">
      <ThemeProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <NextNProgress />
            <ScaffoldEthApp {...props} />
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </PlausibleProvider>
  );
};

export default ScaffoldEthAppWithProviders;
