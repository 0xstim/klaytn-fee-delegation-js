import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { klaytn, klaytnBaobab } from "viem/chains";
import ConnectButton from "@/components/connect-button";
import SendTransaction from "@/components/send-transaction";


// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "cae6041743c6a40d65e966ebffcc49d5";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [klaytn, klaytnBaobab];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });



export default function WithWeb3Modal() {

  return (
    <WagmiConfig config={wagmiConfig}>
      <main className="flex min-h-screen flex-col items-center p-6 md:p-10">
        <div className="flex flex-col max-w-5xl w-full gap-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Try Fee Delegation with Web3Modal
          </h1>
          <div className="mt-10 flex flex-col gap-4">
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Connect with Kaikas with the button below
            </h2>
            <ConnectButton />
          </div>
          <SendTransaction />
        </div>
      </main>
    </WagmiConfig>
  );
}
