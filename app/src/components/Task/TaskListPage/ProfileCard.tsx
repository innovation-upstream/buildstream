import { useTokens } from '@innovationupstream/buildstream-utils'
import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import { useWeb3 } from 'hooks'
import useServerConfirmation from 'hooks/auth/useServerConfirmation'
import { createOrUpdateUser } from 'hooks/profile/functions'
import useProfile from 'hooks/profile/useProfile'
import { useUserStat } from 'hooks/userstat'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from 'SVGs/Badge'
import Correct from 'SVGs/Correct'
import Info from 'SVGs/Info'
import ProfileEdit from 'SVGs/ProfileEdit'

interface Props {
  address?: string
}

const ProfileCard = ({ address }: Props) => {
  const { account } = useWeb3()
  const stat = useUserStat(address)
  const tokens = useTokens()
  const { profile, refetch } = useProfile(address || account)
  const [showForm, setShowForm] = useState(false)
  const { t } = useTranslation('tasks')
  const [displayName, setDisplayName] = useState('')
  const { callAction, component } = useServerConfirmation({
    onError: () => setShowForm(false)
  })

  const totalTokens = stat?.tokens?.reduce(
    (aggregator, curr) => aggregator + curr.count,
    0
  )

  let userId = address
  if (account && !address) {
    userId = account
  }

  const changeDisplayName = async () => {
    if (displayName && displayName !== profile?.displayName) {
      callAction(
        async () =>
          await createOrUpdateUser({
            displayName
          }),
        refetch
      )
    }
    setShowForm(false)
  }

  return (
    <>
      {component}
      <div className='paper'>
        <div className='flex items-center mb-5'>
          {showForm ? (
            <input
              value={displayName}
              placeholder={profile?.displayName || ''}
              onChange={(e) => setDisplayName(e.target.value)}
              className='px-2 py-1 input-base w-full'
            />
          ) : (
            <p className='text-2xl font-semibold'>
              {profile?.displayName || t('your_profile')}
            </p>
          )}
          {showForm ? (
            <button
              onClick={changeDisplayName}
              className='iconContainer shrink-0 flex items-center justify-center rounded-full h-7 md:h-8 w-7 md:w-8 bg-[#F5F5F5] ml-5'
            >
              <Correct className='fill-[#4bae4e]' />
            </button>
          ) : (
            <button className='ml-5' onClick={() => setShowForm(true)}>
              <ProfileEdit />
            </button>
          )}
        </div>
        <div className='flex items-center gap-x-4 my-5'>
          <div className='flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-[#F4F5F8] border-[1px] border-solid border-[#EFF0F1]'>
            <MetamaskSvg width={32} />
          </div>
          <span className='font-semibold'>
            {userId?.substring(0, 7)}...
            {userId?.substring(userId?.length - 4)}
          </span>
        </div>
        <div className='divider' />
        <div className='my-5'>
          <p className='font-semibold mb-2'>{t('your_skills')}</p>
          <div className='flex flex-wrap gap-1 mt-3'>
            {stat.tokens?.map((tag) => (
              <div key={tag.id} className='btn-tag'>
                {tokens?.find((t) => t.id === tag.token.toString())?.name}
                <span className='ml-2 font-bold'>{tag.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='divider' />
        <div className='mt-5 flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <p className='font-semibold'>{t('reputation')} </p>
            <Info />
          </div>
          <div className='flex items-center'>
            <Badge width={40} />
            <span className='text-2xl font-bold'>{totalTokens.toString()}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileCard
