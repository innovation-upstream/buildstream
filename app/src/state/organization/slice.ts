import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Organization } from 'hooks/organization/types'

export interface OrganizationState {
  count: number
  data: Organization[]
  page: { from: number; to: number }
}

const initialState: OrganizationState = {
  count: 0,
  data: [],
  page: {
    from: 0,
    to: 0
  }
}

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    updateCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload
    },
    updateOrganizations: (
      state,
      action: PayloadAction<Pick<OrganizationState, 'page' | 'data'>>
    ) => {
      state.data = action.payload.data
      state.page = action.payload.page
    }
  }
})

export const { updateCount, updateOrganizations } = organizationSlice.actions

export default organizationSlice.reducer
