import { useTokens } from '@innovationupstream/buildstream-utils'
import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { BigNumber, ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import {
  createUpdateRewardMultiplierAction,
  createUpdateRewardTokenAction,
  createUpdateTagRewardMultiplierAction,
} from 'hooks/action/functions'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { Organization } from 'hooks/organization/types'
import { getRewardMultiplier } from 'hooks/task/functions'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const rewardInfo = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Dolor, lobortis auctor amet, sit amet. Nisl parturient nisl.
`

interface RewardProps {
  organization: Organization
  onClose?: () => void
  showAsModal?: boolean
  onRewardChange?: () => void
}

const Reward = ({
  organization,
  onClose,
  showAsModal,
  onRewardChange,
}: RewardProps) => {
  const tagList = useTokens()
  const tokens = organization?.treasury?.tokens
  const [selected, setSelected] = useState(tokens?.[0]?.token)
  const [tag, setTag] = useState(-1)
  const [multiplier, setMultiplier] = useState(0)
  const { t } = useTranslation('organization')
  const { library } = useWeb3()
  const [isSaving, setIsSaving] = useState(false)

  const token = tokens?.find((t) => t.token === selected)
  const { tokenInfos } = useTokenInfos(tokens?.map((t) => t.token))

  const defaultAllTagMultiplier = useMemo(
    () =>
      ethers.utils.formatUnits(
        BigNumber.from(organization.rewardMultiplier || 0)?.toString(),
        tokenInfos?.find((i) => i.address === organization.rewardToken)
          ?.decimal || 18
      ),
    [organization, tokenInfos]
  )

  useEffect(() => {
    if (tag !== -1) return
    setMultiplier(Number(defaultAllTagMultiplier))
  }, [defaultAllTagMultiplier])

  const handleSave = async () => {
    setIsSaving(true)
    const reward = ethers.utils.parseUnits(
      multiplier.toString(),
      tokenInfos?.find((i) => i.address === organization.rewardToken)
        ?.decimal || 18
    )
    const actions = []
    if (selected && organization.rewardToken !== selected)
      actions.push(
        createUpdateRewardTokenAction(
          organization.id,
          selected,
          library.getSigner()
        )
      )

    if (!reward.eq(organization.rewardMultiplier) && tag === -1) {
      actions.push(
        createUpdateRewardMultiplierAction(
          organization.id,
          reward,
          library.getSigner()
        )
      )
    }

    if (!reward.eq(organization.rewardMultiplier) && tag !== -1) {
      actions.push(
        createUpdateTagRewardMultiplierAction(
          organization.id,
          tag,
          reward,
          library.getSigner()
        )
      )
    }

    if (actions.length === 0) return

    try {
      await Promise.all(actions)
    } catch (e) {
      console.error(e)
    }
    onRewardChange?.()
    setIsSaving(false)
  }

  const handleTagChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = parseInt(e.target.value)
    setTag(selectedTag)
    if (selectedTag === -1 && selected === organization.rewardToken) {
      setMultiplier(Number(defaultAllTagMultiplier))
    } else {
      const tagMultiplier = await getRewardMultiplier(
        organization.id,
        [selectedTag],
        library.getSigner()
      )
      const parsedAmount = ethers.utils.formatUnits(
        BigNumber.from(tagMultiplier || 0)?.toString(),
        tokenInfos?.find((i) => i.address === selected)?.decimal || 18
      )
      setMultiplier(Number(parsedAmount) || Number(defaultAllTagMultiplier))
    }
  }

  return (
    <>
      {showAsModal && (
        <div
          onClick={onClose}
          className='fixed w-full h-full bg-black/40 inset-0 z-[51]'
        />
      )}
      <div
        className={`paper ${
          showAsModal &&
          'fixed px-10 py-8 w-[500px] max-w-[90%] z-[52] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'
        }`}
      >
        {showAsModal && (
          <div className='relative mb-5'>
            <button onClick={onClose} className='absolute top-0 -right-5'>
              <CloseIcon />
            </button>
            <p className='text-3xl text-center font-semibold'>
              {t('reward_settings')}
            </p>
          </div>
        )}
        {!showAsModal && (
          <p className='text-2xl font-semibold mb-6'>{t('reward_settings')}</p>
        )}
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
          {t('select_token')}
        </p>
        <select
          className='input-base mt-2'
          value={tag}
          onChange={handleTagChange}
        >
          <option value={-1}>All Tags</option>
          {tagList?.map((t) => (
            <option value={parseInt(t.id)} key={t.id}>
              {t.name}
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
          disabled={
            selected === organization.rewardToken &&
            Number(defaultAllTagMultiplier) === multiplier
          }
          className='w-full btn-primary flex items-center justify-center gap-x-2.5 mt-9'
        >
          {isSaving ? <Spinner /> : t('save')}
        </button>
      </div>
    </>
  )
}

export default Reward
