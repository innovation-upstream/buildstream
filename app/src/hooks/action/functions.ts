import ActionContractInterface from 'contracts/Action.json'
import { BigNumber, ethers } from 'ethers'
import getContract from 'utils/getContract'
import { Action, ActionType } from './types'

export const fetchActionCount = async (
  orgId: number,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const actionCount: BigNumber = await contract.getActionCount(orgId)

  return actionCount.toNumber()
}

export const fetchActionIds = async (
  orgId: number,
  from: number,
  to: number,
  provider?: any
): Promise<number[]> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const actionIds: BigNumber[] = await contract.getActionIds(orgId, from, to)

  return actionIds.map((id) => id.toNumber())
}

export const fetchAction = async (
  actionId: number,
  provider?: any
): Promise<Action> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const action = await contract.getAction(actionId)

  return {
    id: action.id.toNumber(),
    orgId: action.orgId.toNumber(),
    initiator: action.initiator,
    targetAddress: action.targetAddress,
    value: action.value,
    data: action.data,
    executed: action.executed,
    tokenAddress: action.tokenAddress,
    actionType: action.actionType
  }
}

export const fetchActions = async (
  orgId: number,
  from: number,
  to: number,
  provider?: any
) => {
  const actionIds = await fetchActionIds(orgId, from, to, provider)
  const actions = await Promise.all(
    actionIds.map(async (actionId): Promise<Action> => {
      const action = await fetchAction(actionId, provider)
      return action
    })
  )

  return actions
}

export const createAction = async (
  orgId: number,
  targetAddress: string,
  actionType: ActionType,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract[
    'createAction(uint256,address,uint8,bytes,uint256)'
  ](orgId, targetAddress, actionType, ethers.utils.toUtf8Bytes(''), 0)

  const receipt = await tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'ActionCreation')
  const actionId: BigNumber = event?.args?.[1]

  return actionId.toNumber()
}

export const createWithdrawalAction = async (
  orgId: number,
  targetAddress: string,
  value: ethers.BigNumber,
  tokenAddress: string,
  account: string,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract[
    'createAction(uint256,address,uint256,address,uint8,bytes)'
  ](
    orgId,
    targetAddress,
    value,
    tokenAddress,
    ActionType.WITHDRAWAL,
    ethers.utils.toUtf8Bytes(''),
    {
      from: account
    }
  )

  const receipt = await tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'ActionCreation')
  const actionId: BigNumber = event?.args?.[1]

  return actionId.toNumber()
}

export const confirmAction = async (actionId: number, provider?: any) => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract.confirmAction(actionId)
  await tx.wait()
}

export const fetchConfirmers = async (
  actionId: number,
  provider?: any
): Promise<string[]> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const confirmers: string[] = await contract.getConfirmers(actionId)
  return confirmers
}
