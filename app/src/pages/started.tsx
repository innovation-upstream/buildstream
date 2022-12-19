import WalletModal from 'components/Modals/WalletModal'
import { useWeb3 } from 'hooks'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { wrapper } from 'state/store'
import Find from 'SVGs/Find'
import Team from 'SVGs/Team'
import Write from 'SVGs/Write'

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

const Home: NextPage = () => {
  const { account } = useWeb3()
  const [showModal, setShowModal] = useState(false)
  const [actionValue, setActionValue] = useState<typeof action | undefined>()
  const router = useRouter()
  const { t } = useTranslation('home')

  const handleAction = (param?: any) => {
    setActionValue(param)
    if (!account && param !== undefined) {
      setShowModal(true)
      return
    }
    if (param === action.findTask) {
      router.push('/task')
    }
    if (param === action.createTask) {
      router.push('/organization/create')
    }
  }

  useEffect(() => {
    if (account) handleAction(actionValue)
  }, [account])

  return (
    <div className='layout-container'>
      <Head>
        <title>Getting Started</title>
        <meta
          name='description'
          content='Buildstream for Freelancers and Companies'
        />
      </Head>
      {showModal && <WalletModal close={() => setShowModal(!showModal)} />}
      <main className='flex flex-col gap-3 md:gap-28 flex-auto h-screen'>
        <section className='grid-layout mt-0 md:mt-28 gap-0'>
          <span className='col-span-12 md:col-span-8 block text-[#17191A] tracking-[-4px] text-4xl md:text-[112px] leading-normal md:leading-[111px] font-bold'>
            <Trans i18nKey='what_you_wanna_do'>
              What you <br /> wanna do first?
            </Trans>
          </span>
          <span className='block col-span-12 md:hidden'>
            {t('what_you_wanna_do_sub')}
          </span>
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
              onClick={() => handleAction(action.findTask)}
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
              onClick={() => handleAction(action.createTask)}
            >
              {t('get_started')}
            </button>
          </div>

          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#E1F3EC]'>
              <Team />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                {t('find_team_sub')}
              </span>
              <span className='font-normal opacity-50'>{t('find_team')}</span>
            </div>
            <button
              className='btn-primary'
              onClick={() => handleAction(action.findTeam)}
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
