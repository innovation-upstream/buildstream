import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { TaskArchived } from "../generated/schema"
import { TaskArchived as TaskArchivedEvent } from "../generated/TaskStorageContract/TaskStorageContract"
import { handleTaskArchived } from "../src/task-storage-contract"
import { createTaskArchivedEvent } from "./task-storage-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let taskId = BigInt.fromI32(234)
    let newTaskArchivedEvent = createTaskArchivedEvent(taskId)
    handleTaskArchived(newTaskArchivedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TaskArchived created and stored", () => {
    assert.entityCount("TaskArchived", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TaskArchived",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "taskId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
