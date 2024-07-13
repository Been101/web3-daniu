"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  Card,
  Form,
  InputNumber,
  InputNumberProps,
} from "antd";
import { ethers, parseEther } from "ethers";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { valueType } from "antd/es/statistic/utils";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

export default function ReadERC20(props: Props) {
  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<bigint | undefined>();
  const [amount, setAmount] = useState<valueType>(100);
  const [toAddress, setToAddress] = useState<string>("");
  const [accounts, setAccounts] = useState<string[]>([]);
  const providers = useSyncProviders();
  const [provider, setProvider] = useState<EIP1193Provider>();
  const [providerInfo, setProviderInfo] = useState<EIP6963ProviderInfo>();

  async function getAccount() {
    const accounts = await provider?.request<string[]>({
      method: "eth_requestAccounts",
    });
    if (accounts && accounts.length > 0) {
      setAccounts(accounts);
      setCurrentAccount(accounts[0]);
    }
  }

  useEffect(() => {
    getAccount();
  }, [provider]);

  async function transfer() {
    if (!provider) return;
    provider
      ?.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: toAddress,
            value: "0x8ac7230489e80000",
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error(error))
      .finally(() => {
        console.log("2", 2);
      });
    console.log("1", 1);
  }

  // 检测 EIP-6963 提供者
  async function detectProvider() {
    if (typeof window !== "undefined" && window.ethereum) {
      // 确保兼容性
      if (window.ethereum.providers) {
        // 多个提供者的情况，选择其中一个
        return (
          window.ethereum.providers.find((provider) => provider.isMetaMask) ||
          window.ethereum.providers[0]
        );
      }
      return window.ethereum;
    }
    throw new Error("No Ethereum provider detected");
  }

  const transfer2 = async () => {
    const detectedProvider = await detectProvider();
    if (detectedProvider) {
      // 包装成 ethers.js 提供者
      const provider = new ethers.BrowserProvider(detectedProvider);
      const signer = await provider?.getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: parseEther(`${amount}`),
      });
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log("Transaction was mined in block:", receipt?.blockNumber);
      if (currentAccount) {
        const balance = await provider.getBalance(currentAccount);
        setBalance(ethers.formatEther(balance));
      }
    }
  };

  const handleChange: InputNumberProps["onChange"] = (
    value: valueType | null
  ) => {
    setAmount(value || "");
  };

  useEffect(() => {
    if (!currentAccount || !ethers.isAddress(currentAccount)) return;

    if (!provider) {
      console.log("please install MetaMask");
      return;
    }

    provider
      .request<string>({
        method: "eth_getBalance",
        params: [currentAccount, 0x1212],
      })
      .then((result) => {
        console.log("result", result);
        setBalance(ethers.formatEther(result));
      })
      .catch((e) => console.log(e));

    provider
      .request<bigint>({
        method: "eth_chainId",
        params: [],
      })
      .then((chainId) => {
        setChainId(chainId);
      });
  }, [currentAccount]);

  const onClickDisconnect = () => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };

  const onProviderChange = (uuid: string) => {
    const { provider, info } =
      providers.find((p) => p.info.uuid === uuid) || {};
    if (provider) {
      console.log("provider.isMetaMask", provider.isMetaMask);
    }
    setProvider(provider);
    setProviderInfo(info);
  };

  return (
    <div className="p-20">
      <Card title={`Current provider:${providerInfo?.name ?? ""}`}>
        <Select
          onChange={onProviderChange}
          style={{ width: "100%" }}
          options={providers.map((p) => ({
            value: p.info.uuid,
            label: (
              <div className="flex items-center">
                <img src={p.info.icon} alt="" className="w-[20px] h-[20px]" />
                <span className="ml-[20px]">{p.info.name}</span>
              </div>
            ),
          }))}
        ></Select>
      </Card>
      <div className="mb-4"></div>
      <Card title="Account:">
        {currentAccount}
        <Select
          style={{ width: "100%" }}
          defaultValue={currentAccount}
          onChange={(value) => {
            setCurrentAccount(value);
          }}
          options={accounts.map((a) => ({
            value: a,
            label: a,
          }))}
        ></Select>
      </Card>
      <div className="mb-4"></div>
      {currentAccount ? (
        <Card title="Account info:">
          <span>
            ETH Balance of current account:
            <br />
            Balance: {balance}
          </span>
          <br />
          <span>
            Chain Info:
            <br />
            ChainId {chainId} <br />
          </span>
        </Card>
      ) : (
        <></>
      )}
      <div className="mb-4"></div>

      <div className="mb-4"></div>
      <Card title="Transfer:">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item label="Amount:">
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={amount}
              min={10}
              max={1000}
              onChange={handleChange}
            ></InputNumber>
          </Form.Item>
          <Form.Item label="To address: ">
            <Select
              style={{ width: "100%" }}
              defaultValue={currentAccount}
              onChange={(value) => {
                setToAddress(value);
              }}
              options={accounts.map((a) => ({
                value: a,
                label: a,
              }))}
            ></Select>
          </Form.Item>
          <Button type="primary" disabled={!currentAccount} onClick={transfer}>
            Transfer
          </Button>
        </Form>
      </Card>
    </div>
  );
}
