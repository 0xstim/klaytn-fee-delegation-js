import Head from 'next/head'
// import { Inter } from 'next/font/google'
// import { Button } from "@/components/ui/button"
import Link from 'next/link'
// import { CodeBlock, atomOneDark } from "react-code-blocks";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const senderClientCodeBlock = 
`const Caver = require('caver-js');
const caver = new Caver('https://public-en-baobab.klaytn.net');
const senderAddress = "0x07dsadjwqbiudew2138921421fdsf243221325a8";
const senderPrivateKey = "0x1sadqw3io091023201jiort39023049";
const toAddress = "0x35653e324t429a323d3352f24231d123423213a14d15";

sendFeeDelegateTx = async() => {
    // sign transaction with private key of sender
    const transactionData = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_VALUE_TRANSFER',
      from: senderAddress,
      to: toAddress,
      gas: '300000',
      value: caver.utils.toPeb('0.001', 'KLAY'),
    }, senderPrivateKey)

    // console.log(transactionData);

    var result = fetch('http://localhost:3000/api/delegate-fee-from-whitelist', {
      method: 'POST',
      body: JSON.stringify(transactionData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(json => console.log(json));
}

sendFeeDelegateTx();`

  const req =
  `
  {
      messageHash: '0xed7f4e288ef1c23b6c976958e6318cb28cc23d2a7ae5828d60e682cea0be38fc',
      v: '0x05t9',
      r: '0xa6f24e1jdei3730sjs722046689a3f7cfafjeuwoi3870ab2cf3b6498e6bfe33f',
      s: '0x071f13dje8383jfjdu3839373820920945839392yhfjufeuhiufhwfu38824ff5',
      rawTransaction: '0x09f8a0808iishdfiuehwiu38u432fee94274de5f5a9bd7nvjerwnfiehwiufwecfa2d06a1f900ab2cf1382174892140219830121f13d257d79e430ab393bd9fc1ec51c40e3bf2adc2a87fe74a8b3a1c2fcff5940000000000000000000000000000000000000000c4c3018080',
      txHash: '0x93c1ff1a0ncjkahd8217398213921686d49c680f09145d679',
      senderTxHash: '0x24c482648910dheuihdiowq89217389217bd3287fdd20512a5e43c5',
      signatures: [
        [
          '0x07f6',
          '0xa6f24e10f83i2hi3j2483278943819h43h2b48137y3213897126498e6bfe33f',
          '0x071f13d25jodcqwhiuhwqiu428973482137080321c2a87fe74a8b3a1c2fcff5'
        ]
      ]
  }
  ` 

  const res =
  `
  {
    data: {
      transactionHash: '0x2030d13af5fe6c27669f345cd18811db7e08aec6baf672668666a12da9960495',
      status: 'success'
    }
  }
  `

  const h1 = "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
  const h2 = "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  const p = "leading-7 [&:not(:first-child)]:mt-6"
  const h3 = "scroll-m-20 text-2xl font-semibold tracking-tight"
  const h4 = "scroll-m-20 text-xl font-semibold tracking-tight"
  const list = "my-6 ml-6 list-disc [&>li]:mt-2"
  const code = "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-2xl font-semibold"

  return (
    <>
      <Head>
        <title>Klaytn sample fee delegation server</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24`}
      >
        <div className="max-w-5xl">
          <h1 className={h1}>Klaytn Fee Delegation Server example</h1>
          <h2 className={h2}>What is Fee Delegation on Klaytn?</h2>
          <p className={p}>Fee delegation is a feature on Klaytn that allows users to delegate the payment of transaction fees to another user. This can be useful for users who do not have enough KLAY to pay the transaction fee themselves, or for users who want to avoid the hassle of paying transaction fees.</p>
          <p className={p}>To use fee delegation, the sender of the transaction creates a fee delegated transaction. This transaction specifies the recipient of the transaction, the amount of KLAY to be transferred, and the address of the fee payer. The sender then signs the transaction with their private key.</p>
          <p className={p}>The fee payer then signs the transaction with their private key. Once both the sender and fee payer have signed the transaction, it can be submitted to the Klaytn network.</p>
          <p className={p}>When the transaction is submitted, the fee payer&apos;s balance is debited by the amount of the transaction fee. The sender&apos;s balance is credited with the amount of KLAY that was transferred.</p>
          <p className={p}>Fee delegation can be a useful tool for users who want to save money on transaction fees or who want to avoid the hassle of paying transaction fees. However, it is important to note that the fee payer is responsible for paying the transaction fee, even if the sender does not have enough KLAY to cover the fee.</p>
          <h2 className={h2}>Benefits of Fee delegation</h2>
          <ul className={list}>
            <li>Allows users to save money on transaction fees</li>
            <li>Allows users to avoid the hassle of paying transaction fees</li>
            <li>Can be used by users who do not have enough KLAY to pay the transaction fee themselves</li>
            <li>Can be used by users who want to delegate the payment of transaction fees to a trusted third party</li>
          </ul>
          <h2 className={h2}>Risks of Fee delegation</h2>
          <ul className={list}>
            <li>The fee payer is responsible for paying the transaction fee, even if the sender does not have enough KLAY to cover the fee</li>
            <li>The fee payer can refuse to pay the transaction fee, which could result in the transaction being rejected</li>
          </ul>
          <p className={p}>Overall, fee delegation is a useful tool that can be used to save money on transaction fees and to avoid the hassle of paying transaction fees. However, it is important to be aware of the risks involved before using this feature.</p>
          <h2 className={h2}>Specifications of this Fee Delegation Server</h2>
          <ul className={list}>
            <li>This is a NextJS Pages router implementation of Klaytn Fee Delegation server</li>
            <li>Caver-js is the library used for signing fee delegated transactions</li>
            <li>API reference is below and will be updated continuously</li>
          </ul>
          <h2 className={h2}>Documentation</h2>
          <div className='mt-6'>
            <a href="https://github.com/zxstim/klaytn-fee-delegation-js" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">Github repository</a>
          </div>
          <h2 className={h2}>Implementations</h2>
          <div className='flex flex-col gap-4 mt-6'>
            <Link href="/with-caverjs" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">Caverjs</Link>
            <Link href="/with-klaytn-web3modal" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">Klaytn Web3Modal</Link>
            <Link href="/with-web3modal" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">Web3Modal</Link>
          </div>
        </div>
      </main>
    </>
  )
}