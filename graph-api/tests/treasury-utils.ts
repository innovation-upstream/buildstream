import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  TreasuryDeposit,
  TreasuryWithdraw
} from "../generated/Treasury/Treasury"

export function createTreasuryDepositEvent(
  orgId: BigInt,
  tokenAddress: Address,
  amount: BigInt
): TreasuryDeposit {
  let treasuryDepositEvent = changetype<TreasuryDeposit>(newMockEvent())

  treasuryDepositEvent.parameters = new Array()

  treasuryDepositEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  treasuryDepositEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  treasuryDepositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return treasuryDepositEvent
}

export function createTreasuryWithdrawEvent(
  orgId: BigInt,
  tokenAddress: Address,
  recipient: Address,
  amount: BigInt
): TreasuryWithdraw {
  let treasuryWithdrawEvent = changetype<TreasuryWithdraw>(newMockEvent())

  treasuryWithdrawEvent.parameters = new Array()

  treasuryWithdrawEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  treasuryWithdrawEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  treasuryWithdrawEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  treasuryWithdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return treasuryWithdrawEvent
}
