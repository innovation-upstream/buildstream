import Find from 'SVGs/Find'
import Write from 'SVGs/Write'
import WalletModal from 'components/Modals/WalletModal'
import { useWeb3 } from 'hooks'
import { getUserOrganizations } from 'hooks/userstat/functions'
import { IUserOrganizations } from 'hooks/userstat/types'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { wrapper } from 'state/store'

const ACCOUNT = 'account'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      const locale = context.locale ?? ''

      return {
        props: {
          ...(await serverSideTranslations(locale, [
            'common',
            'home',
            'header'
          ]))
        }
      }
    }
  )

enum action {
  findTask,
  createTask,
  findTeam
}

interface IHome {}

const Home: NextPage<IHome> = () => {
  const { account } = useWeb3()
  const [showModal, setShowModal] = useState(false)
  const [actionValue, setActionValue] = useState<typeof action | undefined>()
  const router = useRouter()
  const { t } = useTranslation('home')
  const [orgs, setOrgs] = useState<IUserOrganizations>()

  useEffect(() => {
    if (!account) return
    getUserOrganizations(account as string).then((orgs) => {
      setOrgs(orgs)
      if (actionValue !== undefined) handleAction(actionValue, orgs)
    })
  }, [account])

  const handleAction = async (
    param: any,
    userOrganizations: IUserOrganizations
  ) => {
    if (param === action.findTeam) {
      router.push('/organization')
    }
    if (param === action.findTask) {
      router.push('/task')
    }
    if (param === action.createTask) {
      let org
      if (
        userOrganizations.signerOrganizations.length > 1 ||
        userOrganizations.approverOrganizations.length > 1 ||
        userOrganizations.memberOrganizations.length > 1
      )
        return router.push('/organization')

      if (userOrganizations.signerOrganizations.length === 1)
        org = userOrganizations.signerOrganizations[0]
      else if (userOrganizations.approverOrganizations.length === 1)
        org = userOrganizations.approverOrganizations[0]
      else if (userOrganizations.memberOrganizations.length === 1)
        org = userOrganizations.memberOrganizations[0]
      else return router.push(`/organization/create`)

      router.push(`/organization/${org.id}?create=true`)
    }
  }

  const handleClick = (param?: any) => {
    setActionValue(param)
    if (!account && param !== undefined) {
      setShowModal(true)
      return
    }
    if (!orgs) return
    handleAction(param, orgs)
  }

  return (
    <div className='layout-container'>
      <Head>
        <title>Getting Started</title>
        <meta
          name='description'
          content='Buildstream for Freelancers and Companies'
        />
      </Head>
      {showModal && (
        <WalletModal
          close={() => setShowModal(!showModal)}
        />
      )}
      <main className='flex flex-col gap-3 md:gap-28 flex-auto h-screen'>
        <section className='grid-layout mt-0 md:mt-28 gap-0'>
          <div className='col-span-12 md:col-span-8'>
            <h1 className='block text-[#17191A] lg:tracking-[-4px] text-4xl lg:text-7xl font-bold mb-10'>
              {t('index_body_main')}
            </h1>
            <h2 className='block font-normal text-xl text-[#27272C] opacity-50 text-base tracking-[-0.5px] leading-7'>
              {t('index_body_sub')}
            </h2>
          </div>
          
        </section>
        <section className='grid-layout'>
          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#E7EDFC]'>
              <Find />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                {t('find_task')}
              </span>
              <span className='font-normal opacity-50'>
                {t('finde_task_sub')}
              </span>
            </div>
            <button
              className='btn-primary'
              onClick={() => handleClick(action.findTask)}
            >
              {t('get_started')}
            </button>
          </div>

          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#FCF0E1]'>
              <Write />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                {t('create_task')}
              </span>
              <span className='font-normal opacity-50'>
                {t('create_task_sub')}
              </span>
            </div>
            <button
              className='btn-primary'
              onClick={() => handleClick(action.createTask)}
            >
              {t('get_started')}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
