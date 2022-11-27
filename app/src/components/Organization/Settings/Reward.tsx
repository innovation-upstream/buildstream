import { Organization } from 'hooks/organization/types'
import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import { createAction, createUpdateRewardAction } from 'hooks/action/functions'
import { useWeb3 } from 'hooks'
import { ActionType } from 'hooks/action/types'

const rewardInfo = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Dolor, lobortis auctor amet, sit amet. Nisl parturient nisl.
`

interface RewardProps {
  organization: Organization
}

const Reward = ({ organization }: RewardProps) => {
  const tokens = organization?.treasury?.tokens
  const [selected, setSelected] = useState(tokens?.[0]?.token)
  const [multiplier, setMultiplier] = useState(0)
  const { t } = useTranslation('organization')
  const { library } = useWeb3()

  const token = tokens?.find((t) => t.token === selected)
  const currentMultiplier = ethers.utils.formatUnits(
    BigNumber.from(organization.rewardMultiplier || 0)?.toString(),
    18
  )

  const { tokenInfos } = useTokenInfos(tokens?.map((t) => t.token))

  useEffect(() => {
    setMultiplier(Number(currentMultiplier))
  }, [currentMultiplier])

  const handleSave = async () => {
    if (Number(currentMultiplier) === multiplier) return

    const reward = ethers.utils.parseUnits(multiplier.toString(), 18)
    try {
      await createUpdateRewardAction(
        organization.id,
        reward,
        selected || ethers.constants.AddressZero,
        library.getSigner()
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-6'>{t('reward_settings')}</p>
      <div className='divider' />

      <p className='text-lg font-medium mt-4'>{t('set_a_reward')}</p>
      <p className='text-sm mt-2 text-[#646873]'>{rewardInfo}</p>

      <p className='text-sm font-medium mt-4 text-[#646873]'>
        {t('select_token')}
      </p>
      <select
        className='input-base mt-2'
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {tokens?.map((t) => (
          <option value={t.token} key={t.token}>
            {tokenInfos?.find((i) => i.address === t.token)?.symbol}
          </option>
        ))}
      </select>

      <p className='text-sm font-medium mt-4 text-[#646873]'>
        {t('set_multiplier')}
      </p>
      <input
        className='input-base mt-2'
        value={multiplier}
        onChange={(e) => setMultiplier(Number(e.target.value))}
      />
      <button
        type='button'
        onClick={handleSave}
        disabled={Number(currentMultiplier) === multiplier}
        className='w-full btn-primary flex items-center justify-center gap-x-2.5 mt-9'
      >
        {t('save')}
      </button>
    </div>
  )
}

export default Reward
