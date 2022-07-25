import { useWeb3React } from '@web3-react/core'
import useBalance from 'hooks/balance/useBalance'

const Balances = ({ className }: { className?: string }) => {
  const { account: address } = useWeb3React()
  const { balance } = useBalance()

  if (!address) return null

  return (
    <div className={`absolute top-full left-0 hidden ${className}`}>
      {balance.map((b) => (
        <div
          key={b.name}
          className='inline-flex w-full justify-between items-center bg-neutral-100 border border-neutral-300 focus:outline-none rounded-lg text-base text-black mt-4 md:mt-0'
        >
          <h3 className='py-1 px-4 font-mono'>{b.name}</h3>
          <div className='inline-flex font-mono items-center bg-white border-0 py-1 px-4 focus:outline-none rounded-lg text-base text-black mt-4 mt-0'>
            {b.balance.toNumber()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Balances
