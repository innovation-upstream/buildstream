import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { createOrganization } from 'hooks/organization/functions'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import MainInformation from 'components/Organization/Create/MainInformation'
import TaskConnect from 'components/Organization/Create/TaskConnect'
import Slider from 'components/Slider/Slider'

const sliderTitles = [
  {
    index: 0,
    title: 'Main information'
  },
  {
    index: 1,
    shortTitle: 'Task manager',
    title: 'Connect task manager  platform'
  }
]

const CreateOrgForm = () => {
  const { account, library } = useWeb3()
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!account) {
      console.error('Wallet Not Connected')
      alert('Wallet Not Connected')
      return
    }
    const formData = new FormData(e.target as any)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    try {
      setProcessing(true)
      await createOrganization(
        name,
        description,
        [account],
        [account],
        true,
        library.getSigner()
      )
      router.push('/organization')
    } catch (e) {
      console.log(e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Slider
          titles={sliderTitles}
          onCancel={() => null}
          onComplete={() => null}
        >
          <MainInformation />
          <TaskConnect />
        </Slider>
      </form>
      {processing && (
        <div className='absolute inset-0 z-10 w-full h-full rounded-[46px] flex items-center justify-center bg-zinc-500/30'>
          <Spinner width={100} />
        </div>
      )}
    </>
  )
}

export default CreateOrgForm
