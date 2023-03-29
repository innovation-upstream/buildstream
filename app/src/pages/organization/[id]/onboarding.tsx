import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { useState, useEffect, FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { wrapper } from 'state/store'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import {
  addOrgOnboardingInfo,
  getOrgOnboardingInfo
} from 'hooks/organization/functions'
import { useWeb3 } from 'hooks'
import client from 'graphclient/client'
import { GetOrganizationDocument, Organization } from '../../../../.graphclient'
import { Converter } from 'utils/converter'
import Spinner from 'components/Spinner/Spinner'
import { useTranslation } from 'next-i18next'
import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      const orgId =
        typeof context.params?.id === 'string'
          ? context.params?.id
          : context.params?.id?.[0] || '0'
      const { data } = await client.query({
        query: GetOrganizationDocument,
        variables: {
          id: orgId
        }
      })

      const locale = context.locale ?? ''

      return {
        props: {
          org: data?.organization,
          ...(await serverSideTranslations(locale, [
            'common',
            'organization',
            'header',
            'tasks'
          ]))
        }
      }
    }
  )

interface PageProps {
  org: Organization
}

const OnboardingInfo: NextPage<PageProps> = ({ org }) => {
  const [orgInstruction, setOrgInstruction] = useState({ text: '', html: '' })
  const { account, library } = useWeb3()
  const [organization, setOrganization] = useState(
    Converter.OrganizationFromQuery(org)
  )
  const [editInfo, setEditInfo] = useState(false)
  const [infoProcessing, setInfoProcessing] = useState(false)
  const { t } = useTranslation('organization')

  const getOnboardingInfo = async () => {
    const getInfo = await getOrgOnboardingInfo(organization.id)
    setOrgInstruction((prev) => ({ ...prev, text: getInfo?.onboarding_info }))
  }

  const onboardingInfoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setInfoProcessing(true)
    setEditInfo(!editInfo)

    try {
      const response = await addOrgOnboardingInfo(
        orgInstruction?.text,
        organization.id
      )
      setInfoProcessing(false)
    } catch (err) {
      setInfoProcessing(false)
      console.error(err)
    }
  }

  const shouldEdit = (): boolean => {
    console.log(account)
    return (
      organization.signers.includes(account!) ||
      organization.approvers.includes(account!)
    )
  }

  useEffect(() => {
    getOnboardingInfo()
  }, [])

  return (
    <>
      <Head>
        <title>Buildstream: Organizations</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='layout-container pb-20'>
        <div className='py-5 md:py-12 flex justify-center'>
          <div className='paper w-auto lg:w-2/3'>
            {shouldEdit() && (
              <button
                className={`btn-outline text-blue-700 lg:px-10 ${
                  editInfo ? 'hidden' : 'block'
                }`}
                onClick={() => setEditInfo(!editInfo)}
              >
                Edit
              </button>
            )}
            {editInfo ? (
              <form className='paper mt-4' onSubmit={onboardingInfoSubmit}>
                <h1 className='font-bold text-lg'>
                  {t('onboarding_instruction_header')}
                </h1>
                <h3 className='text-gray-500 mt-2'>
                  {t('onboarding_explainer')}
                  <span className='block text-sm italic'>
                    {t('onboarding_sub_note')}
                  </span>
                </h3>
                <div className='mt-3'>
                  <MarkDownEditor
                    setValue={setOrgInstruction}
                    value={orgInstruction}
                  />
                </div>
                <div className='mt-7'>
                  {infoProcessing && <Spinner width={30} />}
                  {!infoProcessing && (
                    <button type='submit' className='btn-primary lg:px-20'>
                      {t('save')}
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <ReactMarkdown remarkPlugins={[gfm]} className='markdown'>
                {orgInstruction.text}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingInfo
