import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import actionReducer from 'state/action/slice'
import organizationReducer from 'state/organization/slice'
import taskReducer from 'state/task/slice'

const combinedReducer = combineReducers({
  organizations: organizationReducer,
  actions: actionReducer,
  tasks: taskReducer
})

const reducer: typeof combinedReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload
    }
    return nextState
  } else {
    return combinedReducer(state, action)
  }
}

const store = configureStore({
  reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const wrapper = createWrapper(() => store)

export default store
