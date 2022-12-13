import { usePolling, useWeb3 } from 'hooks'
import { TaskSnapshot, TaskStatus } from 'hooks/task/types'
import { useEffect, useMemo, useState } from 'react'
import { Converter } from 'utils/converter'
import { useTranslation } from 'react-i18next'
import isSameDay from 'utils/isSameDay'
import TokenGeneric from 'SVGs/TokenGeneric'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import { ethers } from 'ethers'
import { useGetNotificationsQuery } from 'hooks/notification'
import { Notification } from 'hooks/notification/types'

const messageTemplates: Record<any, string> = {
  1: 'You requested to be assigned <strong>{title}</strong>',
  2: 'You have been assigned <strong>{title}</strong>',
  3: 'You submitted your solution for <strong>{title}</strong>',
  4: 'Your reward for the task <strong>{title}</strong> has been transfered to your account!'
}

const sortAndGroup = (unsorted: Notification[]) => {
  const sortedHistory = unsorted.sort((a, b) =>
    b.timestamp.sub(a.timestamp).toNumber()
  )
  const groupByDays = sortedHistory.reduce((prev, curr) => {
    if (!prev.length) return [[curr]]
    const lastItem = prev[prev.length - 1]
    const index = lastItem?.findIndex((s) => s.id === curr.id)
    if (index !== -1) return prev
    if (
      !isSameDay(
        lastItem[0].timestamp?.mul(1000).toNumber() as number,
        curr.timestamp?.mul(1000).toNumber() as number
      )
    )
      return [...prev, [curr]]

    const newSet = prev
    lastItem.push(curr)
    newSet[newSet.length - 1] = lastItem
    return newSet
  }, [] as Notification[][])

  return groupByDays
}

const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[][]>([])
  const { account } = useWeb3()
  const { data, startPolling, stopPolling } = useGetNotificationsQuery({
    skip: !account,
    variables: {
      where: {
        users_contains_nocase: [account as string]
      }
    }
  })
  usePolling(startPolling, stopPolling)
  const { t } = useTranslation('common')

  useEffect(() => {
    if (!data?.notifications) return
    const newNotifications = data.notifications?.map((t) =>
      Converter.NotificationFromQuery(t as any)
    )
    const allNotifications = [...notifications.flat(), ...newNotifications]
    const groupedByDate = sortAndGroup(allNotifications)
    setNotifications(groupedByDate)
  }, [data])

  const tokens = useMemo(() => {
    const tokenList = notifications.flat().map((s) => s?.task?.rewardToken)
    return Array.from(new Set(tokenList))
  }, [notifications])

  const { tokenInfos } = useTokenInfos(
    tokens.filter((t) => t !== undefined) as string[]
  )

  return (
    <div className='paper p-6'>
      <p className='text-2xl font-semibold mb-6'>{t('recent_activity')}</p>
      <div className='divider' />
      <ul className='pt-6'>
        {notifications?.map((notificationGroup, index) => {
          const date = new Date(
            notificationGroup[0].timestamp?.mul(1000).toNumber() as number
          )
          const dateString = date.toDateString()
          const dateStringArray = dateString.split(' ')
          const [, month, day, year] = dateStringArray
          const isToday = isSameDay(new Date().getTime(), date.getTime())
          return (
            <li key={notificationGroup[0].id}>
              <div className={`flex mb-2.5 ${index !== 0 ? 'mt-4' : ''}`}>
                <p className='text-xl font-semibold'>
                  {isToday ? t('Today') : `${month} ${day}, ${year}`}
                </p>
              </div>
              <ul>
                {notificationGroup?.map((notification) => {
                  const snapshot = notification.taskSnapshot as TaskSnapshot
                  const message = messageTemplates[
                    snapshot.status as any
                  ]?.replace('{title}', snapshot.title)
                  const token = tokenInfos?.find(
                    (i) => i.address === snapshot.rewardToken
                  )
                  const symbol = token?.symbol
                  const reward = ethers.utils.formatUnits(
                    snapshot.rewardAmount?.toString(),
                    token?.decimal
                  )
                  return (
                    <li
                      key={snapshot.timestamp.toString()}
                      className='flex gap-4 flex-col lg:flex-row justify-between p-4 bg-[#F8F9FA] rounded-md mb-2'
                    >
                      <p
                        className='text-[#646873]'
                        dangerouslySetInnerHTML={{
                          __html: message
                        }}
                      />
                      {snapshot.status === TaskStatus.CLOSED && (
                        <div className='flex items-center gap-1 w-fit h-fit border border-[#6BC5A1] px-3 py-2 rounded-md'>
                          +
                          <TokenGeneric width={7} />
                          <span className='font-semibold text-sm whitespace-nowrap'>
                            {`${reward} ${symbol}`}
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserNotifications
