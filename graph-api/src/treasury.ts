import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Treasury, TreasuryToken } from '../generated/schema'
import {
  TreasuryDeposit as TreasuryDepositEvent,
  TreasuryTokenLocked as TreasuryTokenLockedEvent,
  TreasuryTokenUnlocked as TreasuryTokenUnlockedEvent,
  TreasuryWithdraw as TreasuryWithdrawEvent
} from '../generated/Treasury/Treasury'

export function handleTreasuryDeposit(event: TreasuryDepositEvent): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  if (token == Address.zero().toHexString()) token = 'ETH'
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) {
    tTokenEntity = new TreasuryToken(`${orgId}_${token}`)
    tTokenEntity.orgId = orgId
    tTokenEntity.balance = new BigInt(0)
    tTokenEntity.lockedBalance = new BigInt(0)
    tTokenEntity.token = token
  }
  tTokenEntity.balance = tTokenEntity.balance.plus(event.params.amount)
  tTokenEntity.save()
}

export function handleTreasuryWithdraw(event: TreasuryWithdrawEvent): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  if (token == Address.zero().toHexString()) token = 'ETH'
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) return

  tTokenEntity.balance = tTokenEntity.balance.minus(event.params.amount)
  tTokenEntity.save()
}

export function handleTreasuryTokenLocked(
  event: TreasuryTokenLockedEvent
): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  if (token == Address.zero().toHexString()) token = 'ETH'
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) return

  tTokenEntity.lockedBalance = tTokenEntity.lockedBalance.plus(
    event.params.amount
  )
  tTokenEntity.save()
}

export function handleTreasuryTokenUnlocked(
  event: TreasuryTokenUnlockedEvent
): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  if (token == Address.zero().toHexString()) token = 'ETH'
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) return

  tTokenEntity.lockedBalance = tTokenEntity.lockedBalance.minus(
    event.params.amount
  )
  tTokenEntity.save()
}
