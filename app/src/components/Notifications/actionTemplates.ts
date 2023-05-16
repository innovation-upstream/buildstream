import { ActionType } from 'hooks/action/types'

interface IActionMessageTemplate {
  created: string
  confirmed: string
  executed: string
}

export const actionMessageTemplates: Record<
  ActionType,
  IActionMessageTemplate
> = {
  [ActionType.WITHDRAWAL]: {
    created: 'A request to withdraw <strong>{newValue}</strong> has been made',
    confirmed:
      'The request to withdraw <strong>{newValue}</strong> has been confirmed',
    executed: 'The request to withdraw <strong>{newValue}</strong> has been executed'
  },
  [ActionType.ADD_APPROVER]: {
    created:
      'Request to add <strong>{newValue}</strong> to approvers has been made',
    confirmed:
      'Request to add <strong>{newValue}</strong> to approvers has been confirmed',
    executed:
      '<strong>{newValue}</strong> has been added to approvers'
  },
  [ActionType.ADD_SIGNER]: {
    created:
      'Request to add <strong>{newValue}</strong> to admins has been made',
    confirmed:
      'Request to add <strong>{newValue}</strong> to admins has been confirmed',
    executed:
      '<strong>{newValue}</strong> has been added to admins'
  },
  [ActionType.REMOVE_APPROVER]: {
    created:
      'Request to remove <strong>{newValue}</strong> from approvers has been made',
    confirmed:
      'Request to remove <strong>{newValue}</strong> from approvers has been confirmed',
    executed:
      '<strong>{newValue}</strong> has been removed from approvers'
  },
  [ActionType.REMOVE_SIGNER]: {
    created:
      'Request to remove <strong>{newValue}</strong> from admins has been made',
    confirmed:
      'Request to remove <strong>{newValue}</strong> from admins has been confirmed',
    executed:
      '<strong>{newValue}</strong> has been removed from admins'
  },
  [ActionType.UPDATE_NAME]: {
    created:
      'Request to change organization name from <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change organization name from <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Organization name has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_DESCRIPTION]: {
    created:
      'Request to change organization description from <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change organization description from <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Organization description has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_REQUIRED_TASK_APPROVALS]: {
    created:
      'Request to change required task approvals <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change required task approvals <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Required task approvals has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_REQUIRED_CONFIRMATIONS]: {
    created:
      'Request to change required task confirmations <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change required task confirmations <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Required task confirmations has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_REWARD_MULTIPLIER]: {
    created:
      'Request to change reward multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change reward multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Reward multiplier has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_REWARD_TOKEN]: {
    created:
      'Request to change reward token <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change reward token <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Reward token has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_REWARD_SLASH_MULTIPLIER]: {
    created:
      'Request to change reward slash multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change reward slash multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Reward slash multiplier has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_SLASH_REWARD_EVERY]: {
    created:
      'Request to change reward slash interval <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change reward slash interval <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Reward slash interval has been changed to <strong>{newValue}</strong>'
  },
  [ActionType.UPDATE_TAG_REWARD_MULTIPLIER]: {
    created:
      'Request to change tag reward multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been made',
    confirmed:
      'Request to change tag reward multiplier <strong>{oldValue}</strong> to <strong>{newValue}</strong> has been confirmed',
    executed:
      'Tag reward multiplier has been changed to <strong>{newValue}</strong>'
  }
}
