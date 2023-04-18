import { useState } from 'react'
import CloseIcon from 'components/IconSvg/CloseIcon'
import { useTranslation } from 'next-i18next'
import { RedditShareButton } from 'react-share'
import CopyLink from 'SVGs/CopyLink'
import Reddit from 'SVGs/Reddit'

interface IShareTask {
  url: string
  onClose?: () => void
}

const isBrowser = typeof window === 'object'

const ShareTask = ({ url, onClose }: IShareTask) => {
  const [copied, setCopied] = useState(false)

  const { t } = useTranslation('common')

  const copyToClipboard = async () => {
    try {
      isBrowser && (await window.navigator.clipboard.writeText(url))
      setCopied(true)
      await new Promise(() => setTimeout(() => setCopied(false), 2000))
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        className='fixed w-full h-full bg-black/40 inset-0 z-10'
      />
      <div className='fixed paper rounded px-0 py-8 w-[300px] max-w-[90%] z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative'>
          <button onClick={onClose} className='absolute -top-3 right-5'>
            <CloseIcon />
          </button>
          <p className='text-xl font-semibold mx-6 mb-7'>
            {t('share_task')}
          </p>
          <div className='divider mx-6' />
          <ul className='mx-6'>
            <li>
              <button
                onClick={copyToClipboard}
                className='flex items-center gap-x-2 px-3 py-4 w-full hover:bg-zinc-200 border-b-2 border-[#EFF0F1]'
              >
                <CopyLink width={20} />
                <span>
                  {copied ? t('link_copied') : t('copy_link')}
                </span>
              </button>
            </li>
            <li>
              <RedditShareButton url={url} className='w-full'>
                <div className='flex items-center gap-x-2 px-4 py-4 w-full hover:bg-zinc-200 border-b-2 border-[#EFF0F1]'>
                  <Reddit />
                  <span>{t('share_on_reddit')}</span>
                </div>
              </RedditShareButton>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ShareTask
