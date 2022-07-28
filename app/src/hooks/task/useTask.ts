import { useAppSelector } from 'hooks'
import { RootState } from 'state/store'

const useTasks = () => {
  const { count, data, page } = useAppSelector(
    (state: RootState) => state.tasks
  )
  return {
    count,
    page,
    tasks: data
  }
}

export default useTasks
