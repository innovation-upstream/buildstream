import CloseIcon from 'components/IconSvg/CloseIcon'
import { useWeb3 } from 'hooks'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'

interface RequestChangeModalProps {
  taskId: number
  onClose: () => void
}

const RequestChangeModal = ({ onClose }: RequestChangeModalProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)
    const changes = formData.get('changes') as string
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      <div onClick={onClose} className='fixed w-full h-full bg-black/40 inset-0 z-10' />
      <div className='fixed paper w-[672px] max-w-[90%] z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative'>
          <button onClick={onClose} className='absolute right-0'>
            <CloseIcon />
          </button>
          <p className='text-2xl font-semibold mb-6'>{t('request_changes')}</p>
        </div>
        <div className='divider' />
        <p className='text-sm mt-6'>{t('changes_description')}</p>
        <form className='mt-2' onSubmit={submitTask}>
          <textarea className='input-base' name='changes' rows={9} />
          <div className='mt-4 flex gap-x-6'>
            <button className='btn-primary text-sm' type='submit'>
              {t('request_changes')}
            </button>
            <button className='btn-outline border-[#EFF0F1] text-sm' onClick={onClose}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default RequestChangeModal
