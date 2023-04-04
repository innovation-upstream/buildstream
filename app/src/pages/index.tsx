import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import HomeBg from 'SVGs/HomeBg'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { wrapper } from 'state/store'
import { useTranslation } from 'react-i18next'

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

const Home: NextPage = () => {
  const { t } = useTranslation('home')

  return (
    <div className='layout-container'>
      <Head>
        <title>Buildstream</title>
        <meta
          name='description'
          content='Buildstream for Freelancers and Companies'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='py-6 grid-layout'>
        <section className='col-span-6 md:col-span-4 lg:col-span-6 lg:pt-9 flex flex-col gap-9'>
          <h1 className='block text-[#17191A] lg:tracking-[-4px] text-4xl lg:text-7xl font-bold'>
            {t('index_body_main')}
          </h1>
          <h2 className='block font-normal text-[#27272C] opacity-50 text-base tracking-[-0.5px] leading-7'>
            {t('index_body_sub')}
          </h2>
          <Link href={'/started'}>
            <a>
              <button className='btn-primary w-full md:max-w-max px-6'>
                {t('get_started')}
              </button>
            </a>
          </Link>
        </section>
        <section className='col-span-6 md:col-span-4 auto-rows-auto order-first md:order-last lg:col-span-6 relative rounded-3xl'>
          <HomeBg />
        </section>
      </main>
    </div>
  )
}

export default Home
