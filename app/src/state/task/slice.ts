import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from 'hooks/task/types'

export interface TaskState {
  count: number
  data: Task[]
  page: { from: number; to: number }
}

const initialState: TaskState = {
  count: 0,
  data: [],
  page: {
    from: 0,
    to: 0
  }
}

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    updateCount: (state, task: PayloadAction<number>) => {
      state.count = task.payload
    },
    updateTasks: (
      state,
      task: PayloadAction<Pick<TaskState, 'page' | 'data'>>
    ) => {
      state.data = task.payload.data
      state.page = task.payload.page
    }
  }
})

export const { updateCount, updateTasks } = taskSlice.actions

export default taskSlice.reducer
