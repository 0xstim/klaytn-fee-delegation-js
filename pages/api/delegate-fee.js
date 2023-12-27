// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Caver from "caver-js";

export default async function handler(req, res) {
  try {
    const feePayerAddress = process.env.FEE_PAYER_ADDRESS;
    const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    const caver = new Caver("https://public-en-baobab.klaytn.net");
    caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress);
    const receipt = await caver.klay
      .sendTransaction({
        senderRawTransaction: req.body.rawTransaction,
        feePayer: feePayerAddress,
      })
    return res.status(200).json({
      data: {
        transactionHash: receipt.transactionHash,
        status: "success",
      },
    });
  } catch (error) {
    return res.status(403).json({
      data: {
        transactionHash: "none",
        status: "fail",
      },
    });
  }
}
