import React from "react";
import { ConnectButton, Connector, useAccount } from "@ant-design/web3";
import { useSignMessage } from "wagmi";
import { message } from "antd";

const SignDemo: React.FC = () => {
  const { signMessageAsync } = useSignMessage();
  const { account } = useAccount();

  return (
    <Connector>
      <ConnectButton />
    </Connector>
  );
};
export default SignDemo;
