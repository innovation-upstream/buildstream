import TokenGeneric from 'SVGs/TokenGeneric'
import { ethers } from 'ethers'
import { Notification } from 'hooks/notification/types'
import { TokenInfo } from 'hooks/tokenInfo/types'
import { Action } from 'hooks/action/types'
import { DepositRecord } from 'hooks/treasury/types'

interface TreasuryNotificationProps {
  notification: Notification
  tokenInfos?: TokenInfo[]
}

const treasuryMessageTemplates = {
  deposit: '<strong>{value}</strong> has been deposited to the treasury.',
  withdrawal:
    '<strong>{value}</strong> has been withdrawn from the treasury to {address}.'
}

const TreasuryNotification = ({
  notification,
  tokenInfos
}: TreasuryNotificationProps) => {
  const isDeposit = notification.tags.includes('deposit')
  const deposit = notification.deposit as DepositRecord
  const action = notification.action as Action

  const value = isDeposit ? deposit.amount : action.value
  const actor = isDeposit ? deposit.initiator : action.initiator
  const tokenAddress = isDeposit ? deposit.token : action.tokenAddress
  const token = tokenInfos?.find((i) => i.address === tokenAddress)
  const symbol = token?.symbol
  const amount = ethers.utils.formatUnits(value?.toString(), token?.decimal)

  const message = treasuryMessageTemplates[isDeposit ? 'deposit' : 'withdrawal']
    .replace('{value}', `${amount} ${symbol}`)
    .replace('{address}', isDeposit ? deposit.initiator : action.targetAddress)
  return (
    <>
      <div>
        <p className='text-lg font-semibold mb-2'>
          {actor?.substring(0, 7)}...
          {actor?.substring(actor?.length - 4)}
        </p>
        <p
          className='text-[#646873]'
          dangerouslySetInnerHTML={{
            __html: message
          }}
        />
      </div>
      <div
        className={`flex items-center gap-1 w-fit h-fit border ${
          isDeposit ? 'border-[#6BC5A1]' : 'border-[#F55C5C]'
        } px-3 py-2 rounded-md`}
      >
        {isDeposit ? '+' : '-'}
        <TokenGeneric width={7} />
        <span className='font-semibold text-sm whitespace-nowrap'>
          {`${amount} ${symbol}`}
        </span>
      </div>
    </>
  )
}

export default TreasuryNotification
