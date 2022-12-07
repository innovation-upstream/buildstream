import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Deposit, Notification, TreasuryToken } from '../generated/schema'
import {
  TreasuryDeposit as TreasuryDepositEvent,
  TreasuryTokenLocked as TreasuryTokenLockedEvent,
  TreasuryTokenUnlocked as TreasuryTokenUnlockedEvent,
  TreasuryWithdraw as TreasuryWithdrawEvent
} from '../generated/Treasury/Treasury'
import { TREASURY, DEPOSIT } from '../helpers/notification'

export function handleTreasuryDeposit(event: TreasuryDepositEvent): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) {
    tTokenEntity = new TreasuryToken(`${orgId}_${token}`)
    tTokenEntity.orgId = orgId
    tTokenEntity.balance = BigInt.fromI32(0)
    tTokenEntity.lockedBalance = BigInt.fromI32(0)
    tTokenEntity.token = token
  }
  tTokenEntity.balance = tTokenEntity.balance.plus(event.params.amount)
  tTokenEntity.save()

  const depositEntity = new Deposit(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  )
  depositEntity.amount = event.params.amount
  depositEntity.orgId = event.params.orgId
  depositEntity.token = event.params.tokenAddress.toHexString()
  depositEntity.initiator = event.transaction.from.toHexString()
  depositEntity.completedAt = event.block.timestamp
  depositEntity.save()

  const notificationEntity = new Notification(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  )
  notificationEntity.tags = [TREASURY, DEPOSIT]
  notificationEntity.orgId = event.params.orgId.toString()
  notificationEntity.deposit = depositEntity.id
  notificationEntity.save()
}

export function handleTreasuryWithdraw(event: TreasuryWithdrawEvent): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
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
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) return

  tTokenEntity.lockedBalance = tTokenEntity.lockedBalance.minus(
    event.params.amount
  )
  tTokenEntity.save()
}
