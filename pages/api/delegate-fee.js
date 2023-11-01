// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Caver from 'caver-js';

// type Data = {
//   messageHash: string,
//   v: string,
//   r: string,
//   s: string,
//   rawTransaction: string,
//   txHash: string,
//   senderTxHash: string,
//   signatures: string[][]
// }

export default function handler(req, res) {
  const feePayerAddress = process.env.FEE_PAYER_ADDRESS;
  const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
  const caver = new Caver('https://public-en-baobab.klaytn.net');
  caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress);
  caver.klay.sendTransaction({
    senderRawTransaction: req.body.rawTransaction,
    feePayer: feePayerAddress,
  })
  .then(function(receipt) {
    res.status(200).json(
      { 
        data: {
          transactionHash: receipt.transactionHash,
          status: 'success'
        }
      }
    )
  })
}
