import ActionContractInterface from 'contracts/Action.json'
import { BigNumber, ethers } from 'ethers'
import getContract from 'utils/getContract'
import { Action, ActionType } from './types'

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
    'createAction(uint256,address,uint8,bytes,uint256,bool)'
  ](orgId, targetAddress, actionType, ethers.utils.toUtf8Bytes(''), 0, true)

  const receipt = await tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'ActionCreation')
  const actionId: BigNumber = event?.args?.[1]

  return actionId.toNumber()
}

export const createUpdateRewardAction = async (
  orgId: number,
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
    'createAction(uint256,address,uint8,bytes,uint256,bool)'
  ](
    orgId,
    ethers.constants.AddressZero,
    ActionType.UPDATE_REWARD_MULTIPLIER,
    ethers.utils.toUtf8Bytes(''),
    value,
    true
  )

  const receipt = await tx.wait()
  const event = receipt.events.find((e: any) => e.event === 'ActionCreation')
  const actionId: BigNumber = event?.args?.[1]

  return actionId.toNumber()
}

export const createUpdateNameOrDescriptionAction = async (
  orgId: number,
  value: string,
  actionType: ActionType,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract[
    'createAction(uint256,address,uint8,bytes,uint256,bool)'
  ](
    orgId,
    ethers.constants.AddressZero,
    actionType,
    ethers.utils.toUtf8Bytes(value),
    BigNumber.from(0),
    true
  )

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
    'createAction(uint256,address,uint256,address,uint8,bytes,bool)'
  ](
    orgId,
    targetAddress,
    value,
    tokenAddress,
    ActionType.WITHDRAWAL,
    true,
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

export const executeAction = async (actionId: number, provider?: any) => {
  const contract = getContract(
    ActionContractInterface.address,
    ActionContractInterface.abi,
    provider
  )

  const tx = await contract.executeAction(actionId)
  await tx.wait()
}

