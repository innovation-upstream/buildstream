import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { assignToSelf } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

interface IRequestAssignment {
  task: Task
  onClose: () => void
  onSuccess?: () => void
  onError?: () => void
}

const RequestAssignment = ({
  task,
  onClose,
  onSuccess,
  onError,
}: IRequestAssignment) => {
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('tasks')
  const { library } = useWeb3()

  const requestAssignment = async () => {
    try {
      await assignToSelf(task.id, library.getSigner())
      onSuccess?.()
    } catch (e) {
      onError?.()
      console.error(e)
    }
    onClose()
  }

  const handleRequestAssignment = () => {
    setProcessing(true)
    requestAssignment()
  }

  const { tokenInfo } = useTokenInfo(task.rewardToken)
  const rewardAmountValue = ethers.utils.formatUnits(
    task.rewardAmount.toString(),
    tokenInfo?.decimal
  )
  const rewardUsd = parseFloat(rewardAmountValue) * (tokenInfo?.priceUsd || 0)

  return (
    <>
      <div
        onClick={onClose}
        className='fixed w-full h-full bg-black/40 inset-0 z-[51]'
      />
      <div className='paper fixed p-0 w-[500px] max-w-[90%] z-[52] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative px-5 md:px-10 py-8'>
          <div className='relative mb-5'>
            <button
              onClick={onClose}
              className='absolute -top-4 md:top-0 -right-1 md:-right-5'
            >
              <CloseIcon />
            </button>
            <p className='text-3xl text-center font-semibold'>
              {t('request_assignment')}
            </p>
          </div>
          <div className='divider' />
          <div className='mt-5'>
            <span>
              {t('request_task_explainer', {
                amount: rewardUsd.toPrecision(4),
                tokens: task.taskTags.length,
                skills: task.taskTags.map((tag) => tag.name).join(', '),
              })}
            </span>
            <div className='mt-10 flex flex-col md:flex-row items-center gap-4 flex-0'>
              <button
                className='btn-primary min-w-full md:min-w-fit bg-green-700 hover:bg-green-500'
                disabled={processing}
                onClick={handleRequestAssignment}
              >
                {t('continue')}
              </button>
              <button
                className='btn-primary min-w-full md:min-w-fit'
                disabled={processing}
                onClick={onClose}
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

export default RequestAssignment
