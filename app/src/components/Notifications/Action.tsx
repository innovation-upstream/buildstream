import { useWeb3 } from 'hooks'
import { useState } from 'react'
import { ethers } from 'ethers'
import { Notification } from 'hooks/notification/types'
import { TokenInfo } from 'hooks/tokenInfo/types'
import { Action, ActionSnapshot, ActionType } from 'hooks/action/types'
import { confirmAction } from 'hooks/action/functions'
import { executeAction } from 'hooks/organization/functions'
import injected from 'config/Walletconnectors'
import Spinner from 'components/Spinner/Spinner'

interface ActionNotificationsProps {
  notification: Notification
  tokenInfos?: TokenInfo[]
}

const actionMessageTemplates: Record<ActionType, string> = {
  [ActionType.WITHDRAWAL]:
    'WITHDRAWAL:  {action} to withdraw <strong>{value}</strong> from the treasury',
  [ActionType.ADD_APPROVER]:
    'ADD_APPROVER:  {action} to add <strong>{value}</strong> to the list of approvers',
  [ActionType.ADD_SIGNER]:
    'ADD_ADMIN:  {action} to add <strong>{value}</strong> to the list of admins',
  [ActionType.REMOVE_APPROVER]:
    'REMOVE_APPROVER:  {action} to remove <strong>{value}</strong> from the list of approvers',
  [ActionType.REMOVE_SIGNER]:
    'REMOVE_ADMIN:  {action} to remove <strong>{value}</strong> from the list of admins',
  [ActionType.UPDATE_NAME]:
    'UPDATE_NAME:  {action} to change organization name <br/>Suggested name: <br/><strong>{value}</strong>',
  [ActionType.UPDATE_DESCRIPTION]:
    'UPDATE_DESCRIPTION:  {action} to change organization description <br/>Suggested name: <br/><strong>{value}</strong>',
  [ActionType.UPDATE_REQUIRED_TASK_APPROVALS]:
    'UPDATE_REQUIRED_TASK_APPROVALS:  {action} to change required task approvals to <strong>{value}</strong>',
  [ActionType.UPDATE_REQUIRED_CONFIRMATIONS]:
    'UPDATE_REQUIRED_CONFIRMATIONS:  {action} to change required task confirmations to <strong>{value}</strong>',
  [ActionType.UPDATE_REWARD_MULTIPLIER]:
    'UPDATE_REWARD_MULTIPLIER:  {action} to change reward multiplier to <strong>{value}</strong>',
  [ActionType.UPDATE_REWARD_TOKEN]:
    'UPDATE_REWARD_TOKEN:  {action} to change reward token to <strong>{value}</strong>',
  [ActionType.UPDATE_REWARD_SLASH_MULTIPLIER]:
    'UPDATE_REWARD_SLASH_MULTIPLIER:  {action} to change reward slash multiplier to <strong>{value}</strong>',
  [ActionType.UPDATE_SLASH_REWARD_EVERY]:
    'UPDATE_SLASH_REWARD_INTERVAL:  {action} to change reward slash interval to <strong>{value}</strong>',
  [ActionType.UPDATE_TAG_REWARD_MULTIPLIER]:
    'UPDATE_TAG_REWARD_MULTIPLIER:  {action} to change reward multiplier for <strong>{tag}</strong> tag to <strong>{value}</strong>'
}

const ActionNotification = ({
  notification,
  tokenInfos
}: ActionNotificationsProps) => {
  const { account, library, activate } = useWeb3()
  const snapshot = notification.actionSnapshot as ActionSnapshot
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
  let value = snapshot.targetAddress
  if (snapshot.actionType === ActionType.WITHDRAWAL) {
    const token = tokenInfos?.find((i) => i.address === snapshot.tokenAddress)
    const amount = ethers.utils.formatUnits(
      snapshot.value?.toString(),
      token?.decimal
    )
    value = `${amount} ${token?.symbol}`
  }
  if (snapshot.actionType === ActionType.UPDATE_REWARD_TOKEN) {
    const token = tokenInfos?.find((i) => i.address === snapshot.tokenAddress)
    value = token?.symbol || ''
  }
  if (
    snapshot.actionType === ActionType.UPDATE_REQUIRED_TASK_APPROVALS ||
    snapshot.actionType === ActionType.UPDATE_REQUIRED_CONFIRMATIONS
  )
    value = snapshot.value.toString()
  if (
    snapshot.actionType === ActionType.UPDATE_NAME ||
    snapshot.actionType === ActionType.UPDATE_DESCRIPTION
  )
    value = ethers.utils.toUtf8String(snapshot.data)
  if (
    snapshot.actionType === ActionType.UPDATE_REWARD_MULTIPLIER ||
    snapshot.actionType === ActionType.UPDATE_TAG_REWARD_MULTIPLIER
  ) {
    const token = tokenInfos?.find(
      (i) => i.address === notification.orgId.rewardToken
    )
    const amount = ethers.utils.formatUnits(
      snapshot.value?.toString(),
      token?.decimal
    )
    value = `${amount} ${token?.symbol}`
    tag = ethers.utils.toUtf8String(snapshot.data)
  }
  if (snapshot.actionType === ActionType.UPDATE_REWARD_SLASH_MULTIPLIER)
    value = ethers.utils.formatUnits(snapshot.value?.toString(), 18)
  if (snapshot.actionType === ActionType.UPDATE_SLASH_REWARD_EVERY)
    value = snapshot.value?.toString()

  const isConfirmation = snapshot.approvedBy.includes(snapshot.actor)

  const message = actionMessageTemplates[snapshot.actionType]
    ?.replace('{value}', value)
    ?.replace('{tag}', tag)
    ?.replace(
      '{action}',
      snapshot.executed
        ? 'Executed request'
        : isConfirmation
        ? 'Confirmed request'
        : 'Request'
    )

  const isSigner = account && notification.orgId.signers?.includes(account)
  const canApprove = isSigner && !action.approvedBy.includes(account)
  const canExecute =
    isSigner &&
    action.approvedBy.length >= notification.orgId.requiredConfirmations

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
            __html: message
          }}
        />
        {(canApprove || canExecute) && !action.executed && (
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
