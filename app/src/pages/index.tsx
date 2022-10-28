import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import HomeBg from 'SVGs/HomeBg'

const Home: NextPage = () => {
  return (
    <div className='container'>
      <Head>
        <title>Buildstream</title>
        <meta
          name='description'
          content='Buildstream for Freelancers and Companies'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='py-6 grid-layout h-screen'>
        <section className='col-span-6 pt-9 flex flex-col gap-9'>
          <span className='block text-[#17191A] tracking-[-4px] text-[112px] leading-[111px] font-bold'>
            Hire the Top Freelancer or company
          </span>
          <span className='block font-normal text-[#27272C] opacity-50 text-2xl tracking-[-0.5px] leading-7'>
            Buildstream is an exclusive network of the top freelance software
            developers, designers, finance experts, product managers, and
            project managers in the world
          </span>
          <Link href={'/started'}>
            <a>
              <button className='btn-primary max-w-max px-6'>
                Get started now
              </button>
            </a>
          </Link>
        </section>
        <section className='col-span-6 relative rounded-3xl'>
          <HomeBg />
        </section>
      </main>
    </div>
  )
}

export default Home
