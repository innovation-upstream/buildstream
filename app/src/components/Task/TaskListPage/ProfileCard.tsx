import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import { BigNumber } from 'ethers'
import { useWeb3 } from 'hooks'
import useBalance from 'hooks/balance/useBalance'
import { useUserStat } from 'hooks/userstat'
import { useTranslation } from 'react-i18next'
import Badge from 'SVGs/Badge'
import Info from 'SVGs/Info'

interface Props {
  address?: string
}

const ProfileCard = ({ address }: Props) => {
  const { account } = useWeb3()
  const { balance } = useBalance(address)
  const stat = useUserStat(address)

  const totalTokens = balance?.reduce(
    (aggregator, curr) => aggregator.add(curr.balance),
    BigNumber.from(0)
  )

  let userId = address
  if (account && !address) {
    userId = account
  }

  const { t } = useTranslation('tasks')
  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>{t('your_profile')}</p>
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
          {stat.tags?.map((tag) => (
            <div key={tag} className='btn-tag'>
              {tag}
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
  )
}

export default ProfileCard
