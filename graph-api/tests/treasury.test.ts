import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { TreasuryDeposit } from "../generated/schema"
import { TreasuryDeposit as TreasuryDepositEvent } from "../generated/Treasury/Treasury"
import { handleTreasuryDeposit } from "../src/treasury"
import { createTreasuryDepositEvent } from "./treasury-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let orgId = BigInt.fromI32(234)
    let tokenAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newTreasuryDepositEvent = createTreasuryDepositEvent(
      orgId,
      tokenAddress,
      amount
    )
    handleTreasuryDeposit(newTreasuryDepositEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TreasuryDeposit created and stored", () => {
    assert.entityCount("TreasuryDeposit", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TreasuryDeposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orgId",
      "234"
    )
    assert.fieldEquals(
      "TreasuryDeposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TreasuryDeposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
