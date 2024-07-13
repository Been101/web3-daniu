interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  isMetaMask?: boolean;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void;
  request<T>(request: { method: string; params?: Array<unknown> }): Promise<T>;
}

// types.d.ts
interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: Array<any> }) => Promise<any>;
  providers?: EthereumProvider[];
}

interface Window {
  ethereum?: EthereumProvider;
}
