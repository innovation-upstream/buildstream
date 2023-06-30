import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import Spinner from 'components/Spinner/Spinner'
import client from 'graphclient/client'
import { useWeb3 } from 'hooks'
import useServerConfirmation from 'hooks/auth/useServerConfirmation'
import {
  addOrgOnboardingInfo,
  getOrgOnboardingInfo
} from 'hooks/organization/functions'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { Converter } from 'utils/converter'
import { GetOrganizationDocument, Organization } from '../../../../.graphclient'

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
  const [orgInstruction, setOrgInstruction] = useState('')
  const { account, library } = useWeb3()
  const [organization, setOrganization] = useState(
    Converter.OrganizationFromQuery(org)
  )
  const [editInfo, setEditInfo] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('organization')
  const [showForm, setShowForm] = useState(false)
  const [tempInstructions, setTempInstructions] = useState('')
  const { callAction, component } = useServerConfirmation({
    onError: () => setProcessing(false)
  })

  const getOnboardingInfo = async () => {
    const getInfo = await getOrgOnboardingInfo(organization.id)
    setOrgInstruction(getInfo?.onboarding_info)
  }

  const onboardingInfoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setEditInfo(!editInfo)

    callAction(async () => {
      try {
        await addOrgOnboardingInfo(tempInstructions, organization.id)
        setOrgInstruction(tempInstructions)
        setProcessing(false)
        setShowForm(false)
      } catch (err) {
        setProcessing(false)
        console.error(err)
      }
    })
  }

  const onEdit = () => {
    setShowForm(true)
    setTempInstructions(orgInstruction)
  }

  const canEdit =
    account &&
    (organization.signers.includes(account) ||
      organization.approvers.includes(account))

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
      {component}
      <div className='layout-container pb-20'>
        <div className='py-5 md:py-12 flex justify-center'>
          {!showForm && (
            <div className='paper'>
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
                  value={{ text: orgInstruction }}
                  hideToggle
                  readOnly
                  className='!rounded-md'
                />
              </div>
              {canEdit && (
                <div className='mt-7'>
                  <button className='btn-primary lg:px-20' onClick={onEdit}>
                    {t('edit_instructions')}
                  </button>
                </div>
              )}
            </div>
          )}
          {showForm && (
            <form className='paper' onSubmit={onboardingInfoSubmit}>
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
                  onChange={(value) => setTempInstructions(value.text)}
                  value={{ text: tempInstructions }}
                  hideToggle
                  className='!max-h-[60vh]'
                />
              </div>
              <div className='mt-7 flex gap-x-3'>
                {processing && <Spinner width={30} />}
                {!processing && (
                  <button type='submit' className='btn-primary lg:px-20'>
                    {t('save')}
                  </button>
                )}
                <button
                  className='btn-primary bg-rose-400 hover:bg-rose-300 lg:px-20'
                  onClick={() => setShowForm(false)}
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default OnboardingInfo
