import Web3 from 'web3';
import Web3Modal from "@klaytn/web3modal";
import { KaikasWeb3Provider } from "@klaytn/kaikas-web3-provider";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function WithKlaytnWeb3Modal() {
  const DEFAULT_ADDRESS_MESSAGE = "Connect with Wallet :)";
  const [address, setAddress] = useState(DEFAULT_ADDRESS_MESSAGE);
  const [connectButtonLabel, setConnectButtonLabel] = useState("Connect");
  const [balance, setBalance] = useState(0);
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [web3Instance, setWeb3Instance] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const targetNetworkId = process.env.CHAINID || "1001"; // Default to Baobab testnet
  const { toast } = useToast();

  const providerOptions = {
    kaikas: {
      package: KaikasWeb3Provider,
    },
  };

  useEffect(() => {
    const initializeWeb3Modal = () => {
      const _web3Modal = new Web3Modal({
        cacheProvider: false,
        disableInjectedProvider: false,
        providerOptions,
      });
      setWeb3Modal(_web3Modal);
    };

    initializeWeb3Modal();
  }, []);

  const checkNetwork = (_currentChainId) => {
    return _currentChainId == targetNetworkId;
  };

  const reset = async () => {
    setAddress(DEFAULT_ADDRESS_MESSAGE);
    setBalance(0);
    setConnectButtonLabel("Connect");
    setIsFeatureActive(false);
    setWeb3Instance(null);
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  };

  const reload = async () => {
    let element = document.getElementsByClassName('web3modal-provider-wrapper');
    if (element.length > 1) element[0].remove();

    const provider = await web3Modal.connect();

    if (!checkNetwork(provider.networkVersion || provider.chainId)) {
      reset();
      throw new Error("Please select Baobab network");
    }

    let web3, _address, _balance = 0, _providerLabel = "";
    if (!provider.caver) {
      web3 = new Web3(provider);
      _address = provider.selectedAddress;
      _balance = await web3.eth.getBalance(_address);
      if (_balance)
        _balance = web3.utils.fromWei(_balance, "ether").replace(/(\.\d\d\d).*/, "$1");
      _providerLabel = "( Metamask )";
    } else if (provider.caver) {
      web3 = provider.caver;
      let accounts = provider._addresses;
      _address = accounts[0];
      _balance = await web3.klay.getBalance(_address);
      if (_balance) {
        _balance = web3.utils.convertFromPeb(_balance, 'KLAY').replace(/(\.\d\d\d).*/, "$1");
      }
      _providerLabel = "( Kaikas )";
    }

    toast({
      title: 'Connected',
      description: "Connected to Baobab network",
    });

    setAddress(_address.toLowerCase());
    setBalance(_balance.toString());
    setConnectButtonLabel("Baobab Network " + _providerLabel);
    setIsFeatureActive(true);
    setWeb3Instance(web3);
    return provider;
  };

  const disconnect = async () => {
    if (web3Instance && web3Instance.currentProvider && web3Instance.currentProvider.close) await web3Instance.currentProvider.close();
    reset();
    toast({
      title: 'Disconnected',
      description: "Disconnected from Baobab network",
    });
  };

  const connect = async () => {
    if (connectButtonLabel !== 'Connect') return;
    try {
      let provider = await reload();

      provider.on('accountsChanged', async (_accounts) => {
        setAddress(_accounts[0].toLowerCase());
        if (web3Instance.eth) {
          let _balance = await web3Instance.eth.getBalance(_accounts[0]);
          if (_balance) {
            _balance = web3Instance.utils.fromWei(_balance, "ether").replace(/(\.\d\d\d).*/, "$1");
            setBalance(_balance.toString());
          }
        } else if (web3Instance.klay) {
          let _balance = await web3Instance.klay.getBalance(_accounts[0]);
          if (_balance) {
            _balance = web3Instance.utils.convertFromPeb(_balance, 'KLAY').replace(/(\.\d\d\d).*/, "$1");
            setBalance(_balance.toString());
          }
        }
      });

      provider.on('chainChanged', (_networkId) => {
        if (_networkId == targetNetworkId) {
          reload();
        } else {
          reset();
        }
      });

    } catch (err) {
      console.error("Connection error: ", (err.message || err));
      toast({
        title: 'Error',
        description: err.message,
      });
    }
  };

  const sendFeeDelegateTransaction = async () => {
    const txData = {
      type: 'FEE_DELEGATED_VALUE_TRANSFER',
      from: address,
      to: '0xb7d342c2e4640ff1ffdac515e5d22e10dd727938',
      gas: '300000',
      value: "1000000000000000",
    };
    const rawTransaction = await web3Instance.klay.signTransaction(txData);
    console.log(rawTransaction);
    const result = await fetch('http://localhost:3000/api/delegate-fee', {
      method: 'POST',
      body: JSON.stringify(rawTransaction),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    console.log(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-10">
      <div className="flex flex-col max-w-5xl w-full gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Try Fee Delegation with Kaikas and Klaytn Web3Modal
        </h1>
        <div className="mt-10 flex flex-col gap-4">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Connect with Kaikas with the button below
          </h2>
          {connectButtonLabel !== "Connect" ? (
            <Button className="w-fit" onClick={disconnect}>Disconnect</Button>
          ) : (
            <Button className="w-fit" onClick={connect}>Connect</Button>
          )}
        </div>
        <div className="mt-10 flex flex-col">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Wallet Information
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Wallet Address:
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
              {address}
            </code>
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Balance:
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
              {balance} KLAY
            </code>
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-4">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Send delegated fee transaction
          </h2>
          <Button onClick={sendFeeDelegateTransaction} className="w-fit">Sign, Send and Delegate</Button>
        </div>
      </div>
    </main>
  );
}
