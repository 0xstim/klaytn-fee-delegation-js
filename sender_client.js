const Caver = require('caver-js');
const caver = new Caver('https://public-en-baobab.klaytn.net');
const senderAddress = "0x4b1f654eb429a3d225795d3a9bae35b1d3a14d15";
const senderPrivateKey = "0xe2f723ce7b632390dc94b9e3663172de75a24cbf230d99a9fb39135f06ac8392";
const toAddress = "0x07d53b765460ffee94274de5f5a9bd7728fb05a8";

// const senderAddress = "0x07d53b765460ffee94274de5f5a9bd7728fb05a8";
// const senderPrivateKey = "0x1e1df728732c581348fcf5a44982b74d9c01d86cf1cc71ea9ad7c1e606becb72";
// const toAddress = "0x4b1f654eb429a3d225795d3a9bae35b1d3a14d15";

sendFeeDelegateTx = async() => {
    // sign transaction with private key of sender
    const transactionData = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_VALUE_TRANSFER',
      from: senderAddress,
      to: toAddress,
      gas: '300000',
      value: caver.utils.toPeb('0.00001', 'KLAY'),
    }, senderPrivateKey)

    console.log(transactionData);

    var result = fetch('http://localhost:3000/api/delegate-fee', {
      method: 'POST',
      body: JSON.stringify(transactionData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(json => console.log(json));
}

sendFeeDelegateTx();