import { User } from 'models/User/User'
import { useCallback, useEffect, useState } from 'react'
import { getUser } from './functions'

const useProfile = (address?: string) => {
  const [profile, setProfile] = useState<User | null>(null)

  const refetch = useCallback(async () => {
    const data = await getUser(address)
    setProfile(data.user)
  }, [address])

  useEffect(() => {
    if (!address) return
    refetch()
  }, [address, refetch])

  return { profile, refetch }
}

export default useProfile
