// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Caver from "caver-js";

export default async function handler(req, res) {
  const whitelist = ["0x4b1F654eb429a3D225795d3A9baE35B1D3A14d15"];
  try {
    const feePayerAddress = process.env.FEE_PAYER_ADDRESS;
    const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    const caver = new Caver("https://public-en-baobab.klaytn.net");
    caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress);
    const sender = caver.klay.accounts.recover({
      messageHash: req.body.messageHash,
      v: req.body.v,
      r: req.body.r,
      s: req.body.s,
    });

    if (whitelist.includes(sender) === true) {
      const receipt = await caver.klay.sendTransaction({
        senderRawTransaction: req.body.rawTransaction,
        feePayer: feePayerAddress,
      });
      return res.status(200).json({
        data: {
          transactionHash: receipt.transactionHash,
          status: "success",
        },
      });
    }
  } catch (error) {
    return res.status(403).json({
      data: {
        transactionHash: "none",
        status: "fail",
      },
    });
  }
}
