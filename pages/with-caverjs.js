import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Caver from 'caver-js';

export default function WithCaverjsAndMetamask() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [senderAddress, setSenderAddress] = useState(null);
  const [senderPrivateKey, setSenderPrivateKey] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState(null);
  const [txResult, setTxResult] = useState(null);
  const caver = new Caver('https://api.baobab.klaytn.net:8651');


  function handleInputReceivingAddress(e) {
    setReceivingAddress(e.target.value);
  }

  function handleInputSenderAddress(e) {
    setSenderAddress(e.target.value);
  }

  function handleInputSenderPrivateKey(e) {
    setSenderPrivateKey(e.target.value);
  }

  async function importAccount() {
    const account = caver.klay.accounts.privateKeyToAccount(senderPrivateKey);
    caver.klay.accounts.wallet.add(account);
    const balance = await caver.klay.getBalance(senderAddress);
    setBalance(caver.utils.fromPeb(balance, 'KLAY'));
  }

  async function sendFeeDelegateTransaction() {
    // sign transaction with private key of sender
    const transactionData = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_VALUE_TRANSFER',
      from: senderAddress,
      to: receivingAddress,
      gas: '300000',
      value: caver.utils.toPeb('0.00001', 'KLAY'),
    }, senderPrivateKey)
    const result = fetch('http://localhost:3000/api/delegate-fee-from-whitelist', {
      method: 'POST',
      body: JSON.stringify(transactionData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(json => console.log(json))
    .finally(json => {setTxResult(json)});
  }

  // styles
  const h1 = "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
  const h2 = "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  const p = "leading-7 [&:not(:first-child)]:mt-6"
  const h3 = "scroll-m-20 text-2xl font-semibold tracking-tight"
  const h4 = "scroll-m-20 text-xl font-semibold tracking-tight"
  const list = "my-6 ml-6 list-disc [&>li]:mt-2"
  const code = "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-2xl font-semibold"


  return (
    <main
      className="flex min-h-screen flex-col items-center p-6 md:p-10"
    >
      <div className="flex flex-col max-w-5xl w-full">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Tre Fee Delegation with CaverJS</h1>
          <div>
            <div className="flex flex-col gap-4">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">Connect to wallet</h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Import Address and private key here</p>
              <Input onChange={handleInputSenderAddress} type="text" placeholder="Address" />
              <Input onChange={handleInputSenderPrivateKey} type="text" placeholder="Private key" />
              <Button onClick={importAccount} className="w-fit">Import</Button>
              <p>Balance: {balance} KLAY</p>            
            <div className="flex flex-col gap-4"></div>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Please sign a transaction to delegate your fee to the contract</p>
              <Input onChange={handleInputReceivingAddress} type="text" placeholder="Receiving address" />
              <Button onClick={sendFeeDelegateTransaction} className="w-fit">Send and delegate transaction</Button>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {JSON.stringify(txResult)}
            </div>
          </div>
      </div>
    </main>
    )
}