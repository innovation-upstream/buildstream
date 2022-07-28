import { useAppSelector } from 'hooks'
import { RootState } from 'state/store'

const useOrganizations = () => {
  const { count, data, page } = useAppSelector(
    (state: RootState) => state.organizations
  )
  return {
    count,
    page,
    organizations: data
  }
}

export default useOrganizations
