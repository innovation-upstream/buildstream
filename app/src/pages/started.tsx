import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Find from 'SVGs/Find'
import Write from 'SVGs/Write'
import Team from 'SVGs/Team'
import { useWeb3 } from 'hooks'
import WalletModal from 'components/Modals/WalletModal'
import { useRouter } from 'next/router'

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

  const handleAction = (param?: any) => {
    setActionValue(param)
    if (!account && param !== undefined) {
      setShowModal(true)
      return
    }
    if (param === action.createTask) {
      router.push('organization/create')
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
      <WalletModal
        show={showModal}
        toggleModal={() => setShowModal(!showModal)}
      />
      <main className='flex flex-col gap-28 flex-auto h-screen'>
        <section className='grid-layout mt-28'>
          <span className='col-span-8 block text-[#17191A] tracking-[-4px] text-[112px] leading-[111px] font-bold'>
            <span className='block'>What you</span> wanna do first?
          </span>
        </section>
        <section className='grid-layout'>
          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#E7EDFC]'>
              <Find />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                Find a task
              </span>
              <span className='font-normal opacity-50'>
              Create an account as freelancer
              </span>
            </div>
            <button className='btn-primary' onClick={() => handleAction(action.findTask)}>
              Get started now
            </button>
          </div>

          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#FCF0E1]'>
              <Write />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                Create a task
              </span>
              <span className='font-normal opacity-50'>
              Create an account as organization
              </span>
            </div>
            <button className='btn-primary' onClick={() => handleAction(action.createTask)}>
              Get started now
            </button>
          </div>

          <div className='paper col-span-4 flex flex-col gap-9'>
            <div className='flex items-center justify-center rounded-full w-[86px] h-[86px] bg-[#E1F3EC]'>
              <Team />
            </div>
            <div className='flex flex-col items-start'>
              <span className='block font-bold text-4xl text-sm'>
                Find my team
              </span>
              <span className='font-normal opacity-50'>
                Find your organization
              </span>
            </div>
            <button className='btn-primary' onClick={() => handleAction(action.findTeam)}>
              Get started now
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
