import Head from "next/head";
import { ethers } from "ethers";
import Token from "../src/artifacts/contracts/Token.sol/Token.json";
import { useState } from "react";

const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export default function Home() {
  const [showButton, setShowButton] = useState(true);
  const [balance, setBalance] = useState("");
  const [amountToSend, setAmountToSend] = useState(0);
  const [receiver, setReceiver] = useState("");

  const requestAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setShowButton(false);
      showBalance();
    }
  };

  const showBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balanceToSet = await contract.balanceOf(account);
      setBalance(balanceToSet.toString());
      console.log(
        `You have ${balanceToSet.toString()} fun tokens in your account.`
      );
    }
  };

  const sendToken = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);

      const transaction = await contract.transfer(receiver, amountToSend);
      await transaction.wait();
      console.log(transaction);

      showBalance();
      setReceiver("");
      setAmountToSend(0);

      console.log(`Amount being send is: `, amountToSend);
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Abigail's Fun Coin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showButton ? (
        <div>
          <h1 className="font-bold text-3xl mb-8 text-white">
            Abigail's Fun Token
          </h1>
          <button
            onClick={requestAccount}
            className="transform motion-safe:hover:scale-105 bg-gradient-to-r from-blue-200 to-white rounded-xl p-4 hover:cursor-pointer shadow-2xl font-bold hover:bg-white"
          >
            Connect to MetaMask Wallet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 place-content-evenly">
          <h1 className="font-bold text-3xl mb-8 text-white">
            You have: {balance} Fun tokens
          </h1>

          <div className="grid grid-cols-1 gap-2 place-content-evenly">
            <input
              className="border border-transparent rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent "
              placeholder="0"
              onChange={(e) => setAmountToSend(e.target.value)}
              value={amountToSend}
            />

            <input
              className="border border-transparent rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Receiver's Address"
              onChange={(e) => setReceiver(e.target.value)}
              value={receiver}
            />

            <button
              onClick={sendToken}
              className="transform motion-safe:hover:scale-105 hover:bg-purple-900 bg-gradient-to-r from-purple-600 to-purple-900 p-4 rounded-lg text-white font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
