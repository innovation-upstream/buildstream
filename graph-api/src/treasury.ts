import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Treasury, TreasuryToken } from '../generated/schema'
import {
  TreasuryDeposit as TreasuryDepositEvent,
  TreasuryWithdraw as TreasuryWithdrawEvent
} from '../generated/Treasury/Treasury'

export function handleTreasuryDeposit(event: TreasuryDepositEvent): void {
  const orgId = event.params.orgId.toString()
  let token = event.params.tokenAddress.toHexString()
  log.info(`============ ${token} ${Address.zero().toHexString()}`, [])
  if (token == Address.zero().toHexString()) token = 'ETH'
  let tTokenEntity = TreasuryToken.load(`${orgId}_${token}`)
  if (!tTokenEntity) {
    tTokenEntity = new TreasuryToken(`${orgId}_${token}`)
    tTokenEntity.orgId = orgId
    tTokenEntity.balance = new BigInt(0)
    tTokenEntity.token = token
  }
  tTokenEntity.balance = tTokenEntity.balance.plus(event.params.amount)
  tTokenEntity.save()

  let tEntity = Treasury.load(orgId)
  if (!tEntity) {
    tEntity = new Treasury(orgId)
    tEntity.orgId = event.params.orgId
    tEntity.save()
  }
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
