import Spinner from 'components/Spinner/Spinner'
import injected from 'config/Walletconnectors'
import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { confirmAction, executeAction } from 'hooks/action/functions'
import { Action, ActionSnapshot, ActionType } from 'hooks/action/types'
import { Currency } from 'hooks/currency/types'
import { Notification } from 'hooks/notification/types'
import { Organization } from 'hooks/organization/types'
import { useState } from 'react'
import { actionMessageTemplates } from './actionTemplates'

interface ActionNotificationsProps {
  notification: Notification
  tokenInfos?: Currency[]
}

type actionValuesParams = {
  action: Action
  organization: Organization
  tokenInfos?: Currency[]
}

export const getActionValues = ({
  action,
  organization,
  tokenInfos
}: actionValuesParams): { oldValue: any; newValue: any } => {
  let newValue = action.targetAddress
  let oldValue = ''
  if (action.actionType === ActionType.WITHDRAWAL) {
    const token = tokenInfos?.find((i) => i.address === action.tokenAddress)
    const amount = ethers.utils.formatUnits(
      action.value?.toString(),
      token?.decimal
    )
    newValue = `${amount} ${token?.symbol}`
  }
  if (action.actionType === ActionType.UPDATE_REWARD_TOKEN) {
    const token = tokenInfos?.find((i) => i.address === action.tokenAddress)
    const oldToken = tokenInfos?.find(
      (i) => i.address === organization.rewardToken
    )
    oldValue = oldToken?.symbol || ''
    newValue = token?.symbol || ''
  }
  if (action.actionType === ActionType.UPDATE_REQUIRED_TASK_APPROVALS) {
    oldValue = organization.requiredTaskApprovals?.toString()
    newValue = action.value.toString()
  }
  if (action.actionType === ActionType.UPDATE_REQUIRED_CONFIRMATIONS) {
    oldValue = organization.requiredConfirmations?.toString()
    newValue = action.value.toString()
  }
  if (action.actionType === ActionType.UPDATE_NAME) {
    oldValue = organization.name
    newValue = ethers.utils.toUtf8String(action.data)
  }
  if (action.actionType === ActionType.UPDATE_DESCRIPTION) {
    oldValue = organization.description
    newValue = ethers.utils.toUtf8String(action.data)
  }
  if (
    action.actionType === ActionType.UPDATE_REWARD_MULTIPLIER ||
    action.actionType === ActionType.UPDATE_TAG_REWARD_MULTIPLIER
  ) {
    const token = tokenInfos?.find(
      (i) => i.address === organization.rewardToken
    )
    const amount = ethers.utils.formatUnits(
      action.value?.toString(),
      token?.decimal
    )
    const oldAmount = ethers.utils.formatUnits(
      organization.rewardMultiplier?.toString(),
      token?.decimal
    )
    oldValue = `${oldAmount} ${token?.symbol}`
    newValue = `${amount} ${token?.symbol}`
  }
  if (action.actionType === ActionType.UPDATE_REWARD_SLASH_MULTIPLIER) {
    oldValue = ethers.utils.formatUnits(
      organization.rewardSlashMultiplier?.toString(),
      18
    )
    newValue = ethers.utils.formatUnits(action.value?.toString(), 18)
  }
  if (action.actionType === ActionType.UPDATE_SLASH_REWARD_EVERY) {
    oldValue = organization.slashRewardEvery?.toString()
    newValue = action.value?.toString()
  }

  return { oldValue, newValue }
}

const ActionNotification = ({
  notification,
  tokenInfos
}: ActionNotificationsProps) => {
  const { account, library, activate } = useWeb3()
  const snapshot = notification.actionSnapshot as ActionSnapshot
  const organization = snapshot.organizationSnapshot
  const action = notification.action as Action
  const [isProcessing, setIsProcessing] = useState(false)

  const onConfirmAction = async () => {
    setIsProcessing(true)
    try {
      await activate(injected)
      await confirmAction(snapshot.id, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsProcessing(false)
  }

  const onExecuteAction = async () => {
    setIsProcessing(true)
    try {
      await activate(injected)
      await executeAction(snapshot.id, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsProcessing(false)
  }

  let tag = ''
  const { oldValue, newValue } = getActionValues({
    action: snapshot,
    organization,
    tokenInfos
  })

  const isConfirmation = snapshot.approvedBy.includes(snapshot.actor)

  const message = actionMessageTemplates[snapshot.actionType]
  let template = snapshot.executed
    ? message.executed
    : isConfirmation
    ? message.confirmed
    : message.created

  template = template
    ?.replace('{oldValue}', oldValue)
    ?.replace('{newValue}', newValue)

  const isSigner = account && notification.orgId.signers?.includes(account)
  const canApprove = isSigner && !snapshot.approvedBy.includes(account)
  const canExecute =
    isSigner &&
    snapshot.approvedBy.length >= notification.orgId.requiredConfirmations

  return (
    <>
      <div>
        <p className='text-lg font-semibold mb-2'>
          {snapshot.actor?.substring(0, 7)}...
          {snapshot.actor?.substring(snapshot.actor?.length - 4)}
        </p>
        <p
          className='text-[#646873]'
          dangerouslySetInnerHTML={{
            __html: template
          }}
        />
        {action.updateCount === snapshot.updateCount &&
          (canApprove || canExecute) &&
          !action.executed && (
            <div className='flex justify-between items-center mt-5 gap-3'>
              <div className='flex gap-3 flex-wrap'>
                <button
                  onClick={canExecute ? onExecuteAction : onConfirmAction}
                  className='btn-primary text-sm rounded-full'
                >
                  {isProcessing ? (
                    <Spinner />
                  ) : canExecute ? (
                    'Execute'
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  )
}

export default ActionNotification
