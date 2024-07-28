"use client";
import {
  createConfig,
  http,
  useReadContract,
  useSignMessage,
  useWriteContract,
} from "wagmi";
import { mainnet, goerli, polygon } from "wagmi/chains";
import {
  Address,
  NFTCard,
  Connector,
  useAccount,
  useProvider,
} from "@ant-design/web3";
import {
  WagmiWeb3ConfigProvider,
  MetaMask,
  WalletConnect,
  Goerli,
  Polygon,
} from "@ant-design/web3-wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import dynamic from "next/dynamic";
import { Button, message } from "antd";
import { parseEther } from "ethers";

const ConnectButton = dynamic(
  () => import("@ant-design/web3").then((mod) => mod.ConnectButton),
  { ssr: false } // 禁用服务器端渲染
);
const localhost = {
  id: 31337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
};

const config = createConfig({
  chains: [mainnet, goerli, polygon, localhost],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
    [polygon.id]: http(),
    [localhost.id]: http(),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "c07c0051c2055890eade3556618e38a6",
      showQrModal: false,
    }),
  ],
});

const contractInfo = [
  {
    id: 1,
    name: "Ethereum",
    contractAddress: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
  },
  {
    id: 5,
    name: "Goerli",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
  },
  {
    id: 137,
    name: "Polygon",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
  },
  {
    id: localhost.id,
    name: "localhost",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
];

const CallTest = () => {
  const { account } = useAccount();
  const { chain } = useProvider();
  const result = useReadContract({
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "owner", type: "address" }],
        outputs: [{ type: "uint256" }],
      },
    ],
    address: contractInfo.find((item) => item.id === chain?.id)
      ?.contractAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });
  const { writeContract } = useWriteContract();
  console.log("result", result);
  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: contractInfo.find((item) => item.id === chain?.id)
                ?.contractAddress as `0x${string}`,
              functionName: "mint",
              args: [BigInt(1)],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("Mint Success");
              },
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        mint
      </Button>
    </div>
  );
};

const SignDemo = () => {
  const { signMessageAsync } = useSignMessage();
  const { account } = useAccount();

  const doSignature = async () => {
    try {
      const signature = await signMessageAsync({
        message: "test message for sign",
      });
      console.log("signature", signature);
    } catch (error: any) {
      message.error(`Signature failed: ${error.message}`);
    }
  };
  console.log("account", account);
  return (
    <Button disabled={!account?.address} onClick={doSignature}>
      sign message
    </Button>
  );
};

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      wallets={[MetaMask(), WalletConnect()]}
      chains={[Goerli, Polygon, localhost]}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={41}
      />
      <Connector>
        <ConnectButton />
      </Connector>
      <SignDemo />
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}
