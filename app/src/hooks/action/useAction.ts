import { useAppSelector } from 'hooks'
import { RootState } from 'state/store'

const useActions = () => {
  const { count, data, page } = useAppSelector(
    (state: RootState) => state.actions
  )
  return {
    count,
    page,
    actions: data
  }
}

export default useActions
