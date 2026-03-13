import { cookieStorage, createStorage, http } from 'wagmi'
import { wagmiAdapter, projectId } from './appkit'
import { arbitrum, mainnet, sepolia } from 'wagmi/chains'

export function getConfig() {
  return createConfig({
    chains: [arbitrum, mainnet, sepolia],
    transports: {
      [arbitrum.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    storage: createStorage({
      storage: cookieStorage,
    }),
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
