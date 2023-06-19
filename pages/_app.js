import '@/styles/globals.css'

import { Astar } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain= {Astar}>
      <Component {...pageProps} />
    </ThirdwebProvider>

  )
}