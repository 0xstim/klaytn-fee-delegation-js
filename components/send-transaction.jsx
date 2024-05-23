import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { Button } from "./ui/button";

export default function SendTransaction() {
  const { config, error } = usePrepareSendTransaction({
    type: 'FEE_DELEGATED_VALUE_TRANSFER',
    to: '0xb7d342c2e4640ff1ffdac515e5d22e10dd727938',
    value: '1000000000000000',
  })

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction(config)

  return (
    <div>
      <Button  disabled={!sendTransaction} onClick={() => sendTransaction?.()}>
        Send Transaction
      </Button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  )
}