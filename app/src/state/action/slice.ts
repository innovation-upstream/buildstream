import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'hooks/action/types'

export interface ActionState {
  count: number
  data: Action[]
  confirmers: {
    actionId: number
    confirmers: string[]
  }[]
  page: { from: number; to: number }
}

const initialState: ActionState = {
  count: 0,
  data: [],
  confirmers: [],
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
      state.data = action.payload.data.reverse()
      state.page = action.payload.page
    },
    updateConfirmers: (
      state,
      action: PayloadAction<ActionState['confirmers']>
    ) => {
      state.confirmers = action.payload
    }
  }
})

export const { updateCount, updateActions, updateConfirmers } = actionSlice.actions

export default actionSlice.reducer
