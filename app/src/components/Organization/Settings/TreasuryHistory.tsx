import { BigNumber, ethers } from 'ethers'
import { Action } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import { DepositRecord } from 'hooks/treasury/types'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import CaretFilled from 'SVGs/CaretFilled'

interface ITreasuryHistoryProps {
  withdrawalHistory: Action[]
  depositHistory: DepositRecord[]
  organization: Organization
}

function instanceOfWithdrawal(object: any): object is Action {
  return 'executed' in object
}

const isSameDay = (timestampA: number, timestampB: number) => {
  const dateA = new Date(timestampA)
  const dateB = new Date(timestampB)
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  )
}

const sortAndGroup = (unsorted: (Action | DepositRecord)[]) => {
  const sortedHistory = unsorted.sort((a, b) =>
    (b.completedAt as BigNumber).sub(a.completedAt as BigNumber).toNumber()
  )

  const groupByDays = sortedHistory.reduce((prev, curr) => {
    if (!prev.length) return [[curr]]
    const lastItem = prev[prev.length - 1]
    if (
      !isSameDay(
        lastItem[0].completedAt?.mul(1000).toNumber() as number,
        curr.completedAt?.mul(1000).toNumber() as number
      )
    )
      return [...prev, [curr]]

    const newSet = prev
    lastItem.push(curr)
    newSet[newSet.length - 1] = lastItem
    return newSet
  }, [] as (Action | DepositRecord)[][])

  return groupByDays
}

const TreasuryHistory = ({
  withdrawalHistory = [],
  depositHistory = [],
  organization
}: ITreasuryHistoryProps) => {
  const { t } = useTranslation('organization')

  const combinedHistory = useMemo(() => {
    const earliestWithdrawal = withdrawalHistory?.[withdrawalHistory.length - 1]
    const earliestDeposit = depositHistory?.[depositHistory.length - 1]

    if (!earliestDeposit) return sortAndGroup(withdrawalHistory)
    if (!earliestWithdrawal) return sortAndGroup(depositHistory)

    let earliestTime = earliestDeposit.completedAt
    if (earliestTime.gt(earliestWithdrawal.completedAt as BigNumber))
      earliestTime = earliestWithdrawal.completedAt as BigNumber

    const filteredDeposit = depositHistory.filter((d) =>
      d.completedAt.gte(earliestTime)
    )
    const filteredWithdrawal = withdrawalHistory.filter((w) =>
      (w.completedAt as BigNumber).gte(earliestTime)
    )

    const groupByDays = sortAndGroup([
      ...filteredDeposit,
      ...filteredWithdrawal
    ])

    return groupByDays
  }, [withdrawalHistory, depositHistory])

  const { tokenInfos } = useTokenInfos(
    organization.treasury?.tokens?.map((t) => t.token)
  )

  return (
    <div className='paper'>
      <h3 className='font-semibold text-2xl mb-5'>
        {t('deposit_withdrawal_history')}
      </h3>
      <div className='rounded-[10px] bg-[#F5F7F9] py-5 px-6'>
        <ul>
          {combinedHistory.map((c, index) => {
            const date = new Date(
              c[0].completedAt?.mul(1000).toNumber() as number
            )
            const dateString = date.toDateString()
            const dateStringArray = dateString.split(' ')
            const [, month, day, year] = dateStringArray
            const isToday = isSameDay(new Date().getTime(), date.getTime())
            return (
              <li key={c[0].id}>
                <div className={`flex mb-2.5 ${index !== 0 ? 'mt-4' : ''}`}>
                  <p className='text-xl font-semibold'>
                    {isToday ? t('Today') : `${month} ${day}, ${year}`}
                  </p>
                </div>
                <table className='w-full'>
                  {c.map((h) => {
                    const rowDate = new Date(
                      h.completedAt?.mul(1000).toNumber() as number
                    )
                    const isWithdrawal = instanceOfWithdrawal(h)
                    const value = isWithdrawal ? h.value : h.amount
                    const tokenAddress = isWithdrawal ? h.tokenAddress : h.token
                    const tokenInfo = tokenInfos?.find(
                      (i) => i.address === tokenAddress
                    )
                    const amount = ethers.utils.formatUnits(
                      value.toString(),
                      tokenInfo?.decimal
                    )
                    return (
                      <tr key={h.id} className='border-b border-[#E7E7E8]/50'>
                        <td className='w-[120px] font-light py-3'>
                          {`${rowDate.getHours()}:${rowDate.getMinutes()}`}
                        </td>
                        <td>{isWithdrawal ? t('Withdrawal') : t('Deposit')}</td>
                        <td className='w-[15ch]'>
                          <div className='flex gap-x-1.5 items-center'>
                            <span className={isWithdrawal ? '' : 'rotate-180'}>
                              <CaretFilled
                                className={
                                  isWithdrawal
                                    ? 'fill-[#F55C5C]'
                                    : 'fill-[#6AB999]'
                                }
                              />
                            </span>
                            <span
                              className={`font-bold ${
                                isWithdrawal
                                  ? 'text-[#F55C5C]'
                                  : 'text-[#6AB999]'
                              }`}
                            >
                              {amount} {tokenInfo?.symbol}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </table>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default TreasuryHistory
