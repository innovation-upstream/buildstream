import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

interface IServerAuthModal {
  title?: string
  description?: string
  onRequest: () => Promise<void>
  onClose: () => void
  onError?: () => void
}

const ServerAuthModal = ({
  title,
  description,
  onRequest,
  onClose,
  onError
}: IServerAuthModal) => {
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('tasks')

  const requestAuthentication = async () => {
    setProcessing(true)
    await onRequest()
    onClose()
  }

  return (
    <>
      <div
        onClick={onError}
        className='fixed w-full h-full bg-black/40 inset-0 z-[61]'
      />
      <div className='paper fixed p-0 w-[500px] max-w-[90%] z-[62] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative px-5 md:px-10 py-8'>
          <div className='relative mb-5'>
            <button
              onClick={onError}
              className='absolute -top-4 md:top-0 -right-1 md:-right-5'
            >
              <CloseIcon />
            </button>
            <p className='text-3xl text-center text-ellipsis whitespace-nowrap overflow-hidden px-8 font-semibold'>
              {title || t('server_auth_modal_title')}
            </p>
          </div>
          <div className='divider' />
          <div className='mt-5'>
            <span>{description || t('server_auth_modal_body')}</span>
            <div className='mt-10 flex flex-col md:flex-row items-center gap-4 flex-0'>
              <button
                className='btn-primary min-w-full md:min-w-fit bg-green-700 hover:bg-green-500'
                disabled={processing}
                onClick={requestAuthentication}
              >
                {t('continue')}
              </button>
              <button
                className='btn-primary min-w-full md:min-w-fit'
                disabled={processing}
                onClick={onError}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
          {processing && (
            <div className='absolute inset-0 z-10 w-full h-full rounded-2xl flex items-center justify-center bg-zinc-500/30'>
              <Spinner width={100} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ServerAuthModal
