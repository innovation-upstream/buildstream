import Spinner from 'components/Spinner/Spinner'
import injected from 'config/Walletconnectors'
import { usePolling, useWeb3 } from 'hooks'
import { useGetActionsQuery } from 'hooks/action'
import { confirmAction, executeAction } from 'hooks/action/functions'
import { Action } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Converter } from 'utils/converter'
import { getActionValues } from '../../Notifications/Action'
import { actionMessageTemplates } from '../../Notifications/actionTemplates'

interface PendingActionsProps {
  organization: Organization
  actions: Action[]
}

const PendingActions = ({
  actions = [],
  organization
}: PendingActionsProps) => {
  const { account, activate, library } = useWeb3()
  const [pendingActions, setPendingActions] = useState<Action[]>(actions)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const isSigner = account && organization.signers?.includes(account)

  const { data, startPolling, stopPolling } = useGetActionsQuery({
    skip:
      !account ||
      organization.id === undefined ||
      organization.id === null ||
      !isSigner,
    variables: {
      orderDirection: 'desc',
      orderBy: 'actionId',
      where: {
        orgId: organization.id?.toString() as any,
        executed: false
      }
    }
  })
  usePolling(startPolling, stopPolling)
  const { t } = useTranslation('organization')

  useEffect(() => {
    if (!data?.actions) return
    const newActions = data.actions?.map((t) =>
      Converter.ActionFromQuery(t as any)
    )
    setPendingActions(newActions)
  }, [data])

  const tokens = organization.treasury?.tokens?.map((t) => t.token)
  const { tokenInfos } = useTokenInfos(tokens)

  const onConfirmAction = async (actionId: number) => {
    setIsConfirming(true)
    try {
      await activate(injected)
      await confirmAction(actionId, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsConfirming(false)
  }

  const onExecuteAction = async (actionId: number) => {
    setIsExecuting(true)
    try {
      await activate(injected)
      await executeAction(actionId, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsExecuting(false)
  }


  if (!isSigner || !pendingActions?.length) return null

  return (
    <div className='paper p-6'>
      <p className='text-2xl font-semibold mb-6'>{t('pending_actions')}</p>
      <div className='divider' />
      <ul className='pt-6'>
        {pendingActions?.map((action) => {
          const canApprove =
            !action.executed && !action.approvedBy.includes(account)
          const canExecute =
            !action.executed &&
            action.approvedBy.length >= organization.requiredConfirmations

          const { oldValue, newValue } = getActionValues({
            action,
            organization,
            tokenInfos
          })

          const message = actionMessageTemplates[action.actionType]
          let template = message.created

          template = template
            ?.replace('{oldValue}', oldValue)
            ?.replace('{newValue}', newValue)

          if (!canApprove && !canExecute) return null
          return (
            <li key={action.id} className='p-4 bg-[#F8F9FA] rounded-md mb-2'>
              <div>
                <p className='text-lg font-semibold mb-2'>
                  {action.initiator?.substring(0, 7)}...
                  {action.initiator?.substring(action.initiator?.length - 4)}
                </p>
                <p
                  className='text-[#646873]'
                  dangerouslySetInnerHTML={{
                    __html: template
                  }}
                />
                <div className='flex justify-between items-center mt-5 gap-3'>
                  <div className='flex gap-3 flex-wrap'>
                    {canApprove && (
                      <button
                        onClick={() => onConfirmAction(action.id)}
                        className='btn-primary text-sm rounded-full'
                      >
                        {isConfirming ? <Spinner /> : 'Confirm'}
                      </button>
                    )}
                    {canExecute && (
                      <button
                        onClick={() => onExecuteAction(action.id)}
                        className='btn-primary text-sm rounded-full'
                      >
                        {isExecuting ? <Spinner /> : 'Execute'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PendingActions
