import { useAppSelector } from 'hooks'
import { RootState } from 'state/store'

const useTreasury = () => {
  const { count, data, page } = useAppSelector(
    (state: RootState) => state.treasury
  )
  return {
    count,
    page,
    treasury: data
  }
}

export default useTreasury
