import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { createOrganization } from 'hooks/organization/functions'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import MainInformation from 'components/Organization/Create/MainInformation'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'

const sliderTitles = [
  {
    index: 0,
    title: 'main_information'
  },
  {
    index: 1,
    shortTitle: 'task_manager',
    title: 'connect_task_manager'
  }
]

const CreateOrgForm = () => {
  const { account, library } = useWeb3()
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('organization')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!account) {
      toast.error(t('not_connected_wallet'), { icon: '⚠️' })
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
      toast.error(t('error_creating_organization'), { icon: '❌' })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <Toaster position='bottom-left' />
        </div>
        <MainInformation />
        <section className='mt-6'>
          <button type='submit' className='btn-primary lg:px-20'>
            {t('create')}
          </button>
        </section>
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
