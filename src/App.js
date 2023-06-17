import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [lastBlocks, setLastBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      let lastBlockNumber = await alchemy.core.getBlockNumber();
      const last20thBlockNumber = lastBlockNumber - 10;
      const last20Blocks = [];
      for (let i = lastBlockNumber; i > last20thBlockNumber; i--) {
        const block = await alchemy.core.getBlock(i);
        last20Blocks.push(block);
      }
      setLastBlocks(last20Blocks);
    }
    getBlockNumber();
  }, []);

  useEffect(() => {
    if (lastBlocks.length) {
      setSelectedBlock(lastBlocks[0]);
    }
  }, [lastBlocks]);

  useEffect(() => {
    (async () => {
      if (selectedTransaction) {
        const transaction = await alchemy.core.getTransactionReceipt(
          selectedTransaction
        );
        setTransactionInfo(transaction);
      }
    })();
  }, [selectedTransaction]);

  console.log(transactionInfo);

  return (
    <div className="flex flex-col w-screen  min-h-screen ">
      <div className="flex space-x-5 w-screen overflow-x-auto py-5 px-5">
        {lastBlocks.length &&
          selectedBlock &&
          lastBlocks.map((block) => (
            <div
              key={block.hash}
              className={`${
                selectedBlock.hash === block.hash && "border-black"
              } text-sm w-96 break-words space-y-2 cursor-pointer border rounded p-5 cursor-pointer hover:border-black`}
              onClick={() => setSelectedBlock(block)}
            >
              <div>Hash: {block.hash}</div>
              <div>Miner: {block.miner}</div>
              <div>Nonce: {block.nonce}</div>
              <div>Number: {block.number}</div>
            </div>
          ))}
      </div>
      <div className="flex flex-1">
        <div className="w-96 space-y-5 p-3 border-r">
          {selectedBlock !== null &&
            selectedBlock.transactions.map((transaction) => (
              <div
                key={transaction}
                className="break-words border rounded p-3 cursor-pointer underline hover:border-black"
                onClick={() => setSelectedTransaction(transaction)}
              >
                {transaction}
              </div>
            ))}
        </div>
        <div className="flex-1 p-5">
          {/* <div>wtf</div> */}
          {transactionInfo && (
            <div className='text-lg font-bold space-y-5'>
              <div>From: {transactionInfo.from}</div>
              <div>To: {transactionInfo.to}</div>
              <div>BlockNumber: {transactionInfo.blockNumber}</div>
              <div>BlockHash: {transactionInfo.blockHash}</div>
              <div>TransactionHash: {transactionInfo.transactionHash}</div>
              <div>Confirmations: {transactionInfo.confirmations}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
