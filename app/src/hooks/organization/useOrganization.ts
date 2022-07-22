import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Organization } from './types'
import {
  getOrganizationCount,
  getOrganizationIds,
  getOrganization
} from './functions'

const useOrganizations = (initialState: Organization[] = []) => {
  const [organizations, setOrganizations] = useState<Organization[]>(initialState)
  const { library } = useWeb3React()

  const refetchOrganizations = async () => {
    const orgCount = await getOrganizationCount(library)
    const orgIds = await getOrganizationIds(0, orgCount, library)
    const orgs = await Promise.all(
      orgIds.map(async (orgId): Promise<Organization> => {
        const org = await getOrganization(orgId, library)
        return org
      })
    )

    setOrganizations(orgs)
  }

  useEffect(() => {
    refetchOrganizations()
  }, [])

  return {
    organizations,
    refetchOrganizations
  }
}

export default useOrganizations
