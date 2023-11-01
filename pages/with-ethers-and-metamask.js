import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, Klaytn } from '@klaytn/ethers-ext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WithEthersAndMetamask() {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState(null);
  // const router = useRouter();

  async function connectMetaMask() {
    let signer = null;

    let provider;
    
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
        setProvider(provider);
    } else {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        setProvider(provider);
        setSigner(signer);
        setAddress(await signer.getAddress());
        setBalance(await ethers.utils.formatEther(await provider.getBalance(signer.getAddress())));
    } 
  };

  function handleInputReceivingAddress(e) {
    setReceivingAddress(e.target.value);
  }

  async function sendFeeDelegateTransaction() {
    const tx = {
      type: TxType.FeeDelegatedValueTransfer,
      to: receivingAddress,
      value: ethers.parseKlay("0.001")
    };
    const txResponse = await signer.sendTransaction(tx);
    console.log(txResponse);
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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Try Fee Delegation with Metamask</h1>
        {
          provider && signer ? (
            <div>
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Connected to Metamask</h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Your address:</p>
              <p className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold w-fit">{address}</p>
              <p>Balance: {balance} KLAY</p>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Please sign a transaction to delegate your fee to the contract.</p>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Input receiving address</p>
              <Input onChange={handleInputReceivingAddress} type="text" placeholder="Receiving address" />
              <Button onClick={sendTransaction}>Send and delegate transaction</Button>
            </div>
          ) : (
            <div>
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Not connected to MetaMask</h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">Please connect to MetaMask to continue.</p>
              <Button onClick={connectMetaMask}>Connect MetaMask</Button>
            </div>
          )
        }
      </div>
    </main>  
    
    )
}