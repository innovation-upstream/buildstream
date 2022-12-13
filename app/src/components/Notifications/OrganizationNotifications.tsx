import { usePolling } from 'hooks'
import { useEffect, useState } from 'react'
import { Converter } from 'utils/converter'
import { useTranslation } from 'react-i18next'
import isSameDay from 'utils/isSameDay'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import { Organization } from 'hooks/organization/types'
import { useGetNotificationsQuery } from 'hooks/notification'
import { Notification } from 'hooks/notification/types'
import { ActionType } from 'hooks/action/types'
import ActionNotification from './Action'
import TreasuryNotification from './Treasury'
import TaskNotification from './Task'

interface OrganizationNotificationsProps {
  organization: Organization
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

const OrganizationNotifications = ({
  organization
}: OrganizationNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[][]>([])
  const { data, startPolling, stopPolling } = useGetNotificationsQuery({
    skip: !organization.id,
    variables: {
      orderDirection: 'desc',
      where: {
        orgId: organization.id?.toString()
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

  const tokens = organization.treasury?.tokens?.map((t) => t.token)
  const { tokenInfos } = useTokenInfos(tokens)

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
                  if (notification.tags.includes('task')) {
                    return (
                      <li
                        key={notification.timestamp.toString()}
                        className='flex gap-4 flex-col lg:flex-row justify-between p-4 bg-[#F8F9FA] rounded-md mb-2'
                      >
                        <TaskNotification
                          notification={notification}
                          tokenInfos={tokenInfos}
                        />
                      </li>
                    )
                  }
                  if (notification.tags.includes('action')) {
                    return (
                      <>
                        {notification.actionSnapshot?.actionType ===
                          ActionType.WITHDRAWAL &&
                          notification.actionSnapshot?.executed && (
                            <li
                              key={`${notification.timestamp.toString()}-0`}
                              className='flex gap-4 flex-col lg:flex-row justify-between p-4 bg-[#F8F9FA] rounded-md mb-2'
                            >
                              <TreasuryNotification
                                notification={notification}
                                tokenInfos={tokenInfos}
                              />
                            </li>
                          )}
                        <li
                          key={notification.timestamp.toString()}
                          className='flex gap-4 flex-col lg:flex-row justify-between p-4 bg-[#F8F9FA] rounded-md mb-2'
                        >
                          <ActionNotification
                            notification={notification}
                            tokenInfos={tokenInfos}
                          />
                        </li>
                      </>
                    )
                  }
                  if (notification.tags.includes('deposit')) {
                    return (
                      <li
                        key={notification.timestamp.toString()}
                        className='flex gap-4 flex-col lg:flex-row justify-between p-4 bg-[#F8F9FA] rounded-md mb-2'
                      >
                        <TreasuryNotification
                          notification={notification}
                          tokenInfos={tokenInfos}
                        />
                      </li>
                    )
                  }

                  return null
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default OrganizationNotifications
