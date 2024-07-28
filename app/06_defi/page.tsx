"use client";
import { Card } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

function Index() {
  const [hash, setHash] = useState("");
  const [prefiexedHash, setPrefixedHash] = useState("");
  const [keccak256Hash, setKeccak256Hash] = useState("");
  const [hex, setHex] = useState("");
  const [signature, setSignature] = useState<ethers.Signature>();
  const [address, setAddress] = useState("");
  const [address2, setAddres2] = useState("");

  async function main() {
    const msg = "hello web3";
    const msgHash = ethers.hashMessage(msg);
    setHash(msgHash);
    const msgPrefixed = "\x19Ethereum Signed Message:\n" + msg.length + msg;
    const msgPrefixedHash = ethers.id(msgPrefixed);
    setPrefixedHash(msgPrefixedHash);

    const hexString = ethers.hexlify(ethers.toUtf8Bytes(msgPrefixed));
    console.log("hex", hexString);
    setHex(hexString);
    const keccak256Hash = ethers.keccak256(hexString);
    setKeccak256Hash(keccak256Hash);

    const signingKey = new ethers.SigningKey(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const sig = signingKey.sign(msgHash);
    console.log("signature", sig);
    console.log("signature.r", sig.r);
    console.log("signature.s", sig.s);
    console.log("signature.v", sig.v);
    console.log("sig.serialized", sig.serialized);
    console.log("sig.compactSerialized", sig.compactSerialized);

    setSignature(sig);

    // 通过 msgHash 验签
    const address = ethers.recoverAddress(msgHash, sig);
    console.log("address", address);
    setAddress(address);

    // 通过 msg 验签
    const address2 = ethers.verifyMessage(msg, sig);
    console.log("address2", address2);
    setAddres2(address2);
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <>
      <Card title="message: hello web3">
        <h2 className="font-bold">直接使用 ethers.hashMessage 签名(EIP 191)</h2>
        <div> hash:</div>
        <div> {hash}</div>
        <br />
        <h2 className="font-bold">
          通过添加前缀 "\x19Ethereum Signed Message:\n" 签名
        </h2>
        <div> prefixed hash:</div>
        <div> {prefiexedHash}</div>
        <br />
        <h2 className="font-bold">通过keccak256 签名</h2>
        <div>hex:</div>
        <div>{hex}</div>
        <div>keccak256 hash:</div>
        <div>{keccak256Hash}</div>
      </Card>

      <Card title="sign result hash: 使用 signDigest of SigningKey">
        <h2 className="font-bold">privateKey: </h2>

        <img src="/privateKey.png" alt="" />
        <div>
          0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        </div>
        <h2 className="font-bold">signature.r: </h2>
        <div>{signature?.r}</div>
        <h2 className="font-bold">signature.s: </h2>
        <div>{signature?.s}</div>
        <h2 className="font-bold">signature.v: </h2>
        <div>{signature?.v}</div>
        <h2 className="font-bold">signature.serialized: </h2>
        <div className="truncate">{signature?.serialized}</div>
        <h2 className="font-bold">signature.compactSerialized: </h2>
        <div className="truncate">{signature?.compactSerialized}</div>
      </Card>

      <Card title="verify signature">
        <h2 className="font-bold">通过 msgHash 获得 address: </h2>
        <div>{address}</div>
        <h2 className="font-bold">通过 msg 获得 address: </h2>
        <div>{address2}</div>
      </Card>
    </>
  );
}

export default Index;
