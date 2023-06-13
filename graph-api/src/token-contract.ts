import { BigInt } from '@graphprotocol/graph-ts'
import { SBTRewardUser as SBTRewardUserEvent } from '../generated/TokenContract/TokenContract'
import { UserToken } from '../generated/schema'

export function handleSBTRewardUser(event: SBTRewardUserEvent): void {
  const user = event.params.user.toString()
  const token = event.params.tokenId
  const amount = event.params.amount

  const entityId = `${user}-${token.toString()}`
  let entity = UserToken.load(entityId)
  if (!entity) {
    entity = new UserToken(entityId)
    entity.user = user
    entity.token = token
    entity.count = BigInt.fromI32(0)
  }
  entity.count = entity.count.plus(amount)
  entity.save()
}
