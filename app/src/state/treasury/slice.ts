import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Treasury } from 'hooks/treasury/types'

export interface TreasuryState {
  count: number
  data: Treasury[]
  page: { from: number; to: number }
}

const initialState: TreasuryState = {
  count: 0,
  data: [],
  page: {
    from: 0,
    to: 0
  }
}

export const treasurySlice = createSlice({
  name: 'treasury',
  initialState,
  reducers: {
    updateCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload
    },
    updateTreasury: (
      state,
      action: PayloadAction<Pick<TreasuryState, 'page' | 'data'>>
    ) => {
      state.data = action.payload.data
      state.page = action.payload.page
    }
  }
})

export const { updateCount, updateTreasury } = treasurySlice.actions

export default treasurySlice.reducer
