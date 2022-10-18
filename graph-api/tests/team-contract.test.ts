import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { TaskAssignment } from "../generated/schema"
import { TaskAssignment as TaskAssignmentEvent } from "../generated/TeamContract/TeamContract"
import { handleTaskAssignment } from "../src/team-contract"
import { createTaskAssignmentEvent } from "./team-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let teamAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let taskId = BigInt.fromI32(234)
    let assignee = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newTaskAssignmentEvent = createTaskAssignmentEvent(
      teamAddress,
      taskId,
      assignee
    )
    handleTaskAssignment(newTaskAssignmentEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TaskAssignment created and stored", () => {
    assert.entityCount("TaskAssignment", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TaskAssignment",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "teamAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TaskAssignment",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "234"
    )
    assert.fieldEquals(
      "TaskAssignment",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assignee",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
