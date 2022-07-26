import ActionContractInterface from 'contracts/Action.json'
import { BigNumber, ethers } from 'ethers'
import getContract from 'utils/getContract'
import { Action, ActionType } from './types'

export const getActionCount = async (
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

export const getActionIds = async (
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

export const getAction = async (
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
    targetAddress: action.targetAddress,
    value: action.value,
    data: action.data,
    executed: action.executed,
    tokenAddress: action.tokenAddress,
    actionType: action.actionType
  }
}

export const createAction = async (
  orgId: number,
  targetAddress: string,
  actionType: number,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract[
    'createAction(uint256,address,uint8,bytes)'
  ](
    orgId,
    targetAddress,
    ActionType.WITHDRAWAL,
    ethers.utils.toUtf8Bytes('')
  )

  const receipt = tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'Creation')
  const actionId: BigNumber = event?.args?.[0]

  return actionId.toNumber()
}

export const createWithdrawalAction = async (
  orgId: number,
  targetAddress: string,
  value: ethers.BigNumber,
  tokenAddress: string,
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
    ethers.utils.toUtf8Bytes('')
  )

  const receipt = tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'Creation')
  const actionId: BigNumber = event?.args?.[0]

  return actionId.toNumber()
}
