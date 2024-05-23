const Caver = require('caver-js');
const caver = new Caver('https://public-en-baobab.klaytn.net');
const senderAddress = "";
const senderPrivateKey = "";
const toAddress = "";


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