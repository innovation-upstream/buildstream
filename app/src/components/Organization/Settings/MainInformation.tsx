import Camera from 'SVGs/Camera'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { createUpdateNameOrDescriptionAction } from 'hooks/action/functions'
import { ActionType } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

const MainInformation = ({ organization }: { organization: Organization }) => {
  const { account, library } = useWeb3()
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('organization')
  const [name, setName] = useState(organization.name)
  const [description, setDescription] = useState(organization.description)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!account) {
      console.error('Wallet Not Connected')
      alert(t('not_connected_wallet'))
      return
    }

    if (name === organization.name && description === organization.description)
      return

    try {
      setProcessing(true)
      const transactions = []
      if (name !== organization.name)
        transactions.push(
          createUpdateNameOrDescriptionAction(
            organization.id,
            name,
            ActionType.UPDATE_NAME,
            library.getSigner()
          )
        )
      if (description !== organization.description)
        transactions.push(
          createUpdateNameOrDescriptionAction(
            organization.id,
            description,
            ActionType.UPDATE_DESCRIPTION,
            library.getSigner()
          )
        )
      await Promise.all(transactions)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form className='paper' onSubmit={handleSubmit}>
      <div className='mt-3.5'>
        <div className='text-center w-fit'>
          <label className='relative cursor-not-allowed flex flex-col items-center justify-center block rounded-full w-36 h-36 bg-[#F8F9FA]'>
            <Camera />
            <span className='mt-3 text-sm text-secondary'>
              {t('upload_logo')}
            </span>
            <input
              disabled
              type='file'
              className='absolute w-0 h-0 invisible'
            />
          </label>
        </div>
        <label htmlFor='name' className='block mt-6 mb-2 text-sm'>
          {t('full_name_org')}
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={name}
          placeholder={organization.name}
          onChange={(e) => setName(e.target.value)}
          className='input-base'
        />
        <label htmlFor='description' className='block mt-6 mb-2 text-sm'>
          {t('short_description')}
        </label>
        <textarea
          id='description'
          name='description'
          value={description}
          placeholder={organization.description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className='input-base'
        />
      </div>
      <div className='mt-3 underline text-blue-600'>
        <a href={`/organization/${organization.id}/onboarding`}>
          {t('view_edit_onboarding')}
        </a>
      </div>
      <button
        type='submit'
        disabled={
          processing ||
          (name === organization.name &&
            description === organization.description)
        }
        className='btn-primary lg:px-20 mt-7'
      >
        {processing ? <Spinner /> : t('save')}
      </button>
    </form>
  )
}

export default MainInformation
