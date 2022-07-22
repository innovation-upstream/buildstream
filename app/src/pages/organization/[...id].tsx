import useOrganizations from 'hooks/organization/useOrganization'
import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
  getOrganizationCount,
  getOrganizationIds,
  getOrganization
} from 'hooks/organization/functions'
import { Organization } from 'hooks/organization/types'
import { ethers } from 'ethers'

interface PageProps {
  id: number
  orgs: Organization[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const orgId = context.params?.id?.[0]
  const orgCount = await getOrganizationCount()
  const orgIds = await getOrganizationIds(0, orgCount)
  const orgs = await Promise.all(
    orgIds.map(async (orgId): Promise<Organization> => {
      const org = await getOrganization(orgId)
      return org
    })
  )

  const serializedOrgs = orgs.map((o) => ({
    ...o,
    rewardMultiplier: JSON.parse(JSON.stringify(o.rewardMultiplier))
  }))

  return {
    props: {
      id: orgId ? parseInt(orgId) : 0,
      orgs: serializedOrgs
    }
  }
}

const OrganizationPage: NextPage<PageProps> = ({ id, orgs }) => {
  const { organizations } = useOrganizations(orgs)
  const router = useRouter()

  const selected = organizations.find((o) => o.id === id)

  const onSelect = (id: number) => {
    router.push(`/organization/${id}`)
  }

  return (
    <div className="container justify-between mx-auto flex flex-wrap p-5 flex-col md:flex-row">
      <ul className="w-full md:basis-6/12 divide-y divide-gray-100">
        {organizations.map((org, index) => (
          <li
            key={`${org.id}-${index}`}
            className="p-3 hover:bg-blue-600 hover:text-blue-200"
            onClick={() => onSelect(org.id)}
          >
            <h3 className="font-bold text-xl">{org.name}</h3>
            <p className="mt-3">{org.description}</p>
          </li>
        ))}
      </ul>
      <div className="w-full h-full top-20 sticky px-5 py-10 bg-white md:basis-4/12 rounded-sm shadow">
        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
          {selected?.name}
        </h1>
        <p className="lg:w-2/3 leading-relaxed text-base text-gray-500">
          {selected?.description}
        </p>
        <p className="text-lg mt-10 break-all">
          Approvers:{' '}
          <span className="text-sm text-gray-500">
            {selected?.approvers.toString()}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Reviewers:{' '}
          <span className="text-sm text-gray-500">
            {selected?.reviewers.toString()}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Signers:{' '}
          <span className="text-sm text-gray-500">
            {selected?.signers.toString()}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Required task approvals:{' '}
          <span className="text-sm text-gray-500">
            {selected?.requiredTaskApprovals}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Required confirmations:{' '}
          <span className="text-sm text-gray-500">
            {selected?.requiredConfirmations}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Reward multiplier:{' '}
          <span className="text-sm text-gray-500">
            {selected?.rewardMultiplier.toString()}
          </span>
        </p>
        <p className="text-lg mt-3 break-all">
          Reward token:{' '}
          <span className="text-sm text-gray-500">
            {selected?.rewardToken === ethers.constants.AddressZero
              ? null
              : selected?.rewardToken}
          </span>
        </p>
      </div>
    </div>
  )
}

export default OrganizationPage
