import { BigNumber, ethers } from 'ethers'
import { GetOrganizationsDocument, Organization } from 'graphclient'
import client from 'graphclient/client'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { useGetOrganizationsQuery, usePolling } from 'hooks'
import { Converter } from 'utils/converter'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      const { data } = await client.query({
        query: GetOrganizationsDocument
      })
      return {
        props: {
          orgs: data?.organizations
        }
      }
    }
  )

const OrganizationPage: NextPage<{ orgs: Organization[] }> = ({ orgs }) => {
  const [organizations, setOrganizations] = useState(
    orgs.map((o) => Converter.OrganizationFromQuery(o))
  )
  const [selectedOrg, setSelectedOrg] = useState(0)
  const selected = organizations?.find((o) => o.id == selectedOrg)

  const onSelect = (id: number) => {
    setSelectedOrg(id)
  }

  const { data, startPolling, stopPolling } = useGetOrganizationsQuery()
  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (data?.organizations) {
      setOrganizations(
        data?.organizations?.map((o) => Converter.OrganizationFromQuery(o)) ||
          []
      )
    }
  }, [data])

  return (
    <div>
      <Head>
        <title>Buildstream: Organizations</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container w-full mx-auto p-5'>
        <Link href='/organization/create'>
          <a className='mr-5 hover:text-gray-900'>
            <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
              Create
            </button>
          </a>
        </Link>
      </div>
      <div className='container justify-between mx-auto flex flex-wrap p-5 flex-col md:flex-row'>
        <ul className='w-full md:basis-6/12 divide-y divide-gray-100'>
          {organizations?.map((org, index) => (
            <li
              key={`${org.id}-${index}`}
              className='p-3 hover:bg-blue-600 hover:text-blue-200'
              onClick={() => onSelect(org.id)}
            >
              <h3 className='font-bold text-xl'>{org.name}</h3>
              <p className='mt-3'>{org.description}</p>
            </li>
          ))}
        </ul>
        <div className='w-full h-full top-20 sticky px-5 py-10 bg-white md:basis-4/12 rounded-sm shadow'>
          <h1 className='sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900'>
            {selected?.name}
          </h1>
          <p className='lg:w-2/3 leading-relaxed text-base text-gray-500'>
            {selected?.description}
          </p>
          <p className='text-lg mt-10 break-all'>
            Approvers:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.approvers.toString()}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Reviewers:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.reviewers.toString()}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Signers:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.signers.toString()}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Required task approvals:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.requiredTaskApprovals.toString()}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Required confirmations:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.requiredConfirmations.toString()}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Balance:{' '}
            {selected?.treasury?.tokens?.map((b, index) => (
              <span key={index} className='text-sm text-gray-500'>
                {ethers.utils.formatUnits(
                  BigNumber.from(b.balance)?.toString(),
                  18
                )}
              </span>
            ))}
          </p>
          <p className='text-lg mt-3 break-all'>
            Reward multiplier:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.rewardMultiplier
                ? ethers.utils
                    .formatEther(
                      BigNumber.from(selected?.rewardMultiplier).toString()
                    )
                    .toString()
                : ''}
            </span>
          </p>
          <p className='text-lg mt-3 break-all'>
            Reward token:{' '}
            <span className='text-sm text-gray-500'>
              {selected?.rewardToken === ethers.constants.AddressZero
                ? null
                : selected?.rewardToken}
            </span>
          </p>
          <Link href={`/organization/${selected?.id}`}>
            <a className='block mt-10 text-blue-700'>{`view ${selected?.name}`}</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage
