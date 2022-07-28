import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'hooks/action/types'

export interface ActionState {
  count: number
  data: Action[]
  page: { from: number; to: number }
}

const initialState: ActionState = {
  count: 0,
  data: [],
  page: {
    from: 0,
    to: 0
  }
}

export const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    updateCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload
    },
    updateActions: (
      state,
      action: PayloadAction<Pick<ActionState, 'page' | 'data'>>
    ) => {
      state.data = action.payload.data
      state.page = action.payload.page
    }
  }
})

export const { updateCount, updateActions } = actionSlice.actions

export default actionSlice.reducer
