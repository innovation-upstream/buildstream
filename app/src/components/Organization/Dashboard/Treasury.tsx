import Copy from 'SVGs/Copy'
import Gear from 'SVGs/Gear'
import Plus from 'SVGs/Plus'
import TokenGeneric from 'SVGs/TokenGeneric'
import Deposit from 'components/Deposit/Deposit'
import TreasuryAbi from 'contracts/Treasury.json'
import { BigNumber, ethers } from 'ethers'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { Organization } from 'hooks/organization/types'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TreasuryProps {
  organization: Organization
}

const AddressZero = ethers.constants.AddressZero

const Treasury = ({ organization }: TreasuryProps) => {
  const tokens = organization?.treasury?.tokens
  const [selected, setSelected] = useState(tokens?.[0]?.token)
  const [openDeposit, setOpenDeposit] = useState(false)
  const { t } = useTranslation('organization')

  let tokenList = organization.treasury?.tokens?.map((t) => t.token) || []
  tokenList = Array.from(new Set([...tokenList, AddressZero]))
  const token = tokens?.find((t) => t.token === selected)
  const { tokenInfos } = useTokenInfos(tokenList)
  const tokenInfo = tokenInfos?.find((i) => i.address === selected)
  const balance = ethers.utils.formatUnits(
    BigNumber.from(token?.balance || 0)?.toString(),
    tokenInfo?.decimal
  )

  return (
    <div className='paper'>
      <div className='flex items-center justify-between mb-5'>
        <p className='text-2xl font-semibold'>{t('treasury')}</p>
        <Link href={`/organization/${organization.id}/settings`}>
          <button>
            <Gear />
          </button>
        </Link>
      </div>
      <div className='flex items-center mb-5'>
        <div className='flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#28C76F] to-[#81FBB8]'>
          <TokenGeneric width={22} className='fill-white' />
        </div>
        <p className='ml-4 text-2xl font-semibold'>{balance}</p>
      </div>
      <div className='flex items-center justify-between rounded-md border border-[#E2E2E2] border-dashed py-3 px-4 mb-5'>
        <p>
          {TreasuryAbi.address?.substring(0, 7)}...
          {TreasuryAbi.address?.substring(TreasuryAbi.address?.length - 4)}
        </p>
        <button>
          <Copy />
        </button>
      </div>
      <div className='divider' />
      <p className='mb-3 mt-4 text-lg font-medium'>{t('reward_token')}</p>
      <select
        className='input-base text-2xl font-bold'
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {tokenList?.map((token) => (
          <option value={token} key={token}>
            {tokenInfos?.find((i) => i.address === token)?.symbol}
          </option>
        ))}
      </select>
      <button
        type='button'
        onClick={() => setOpenDeposit(true)}
        className='w-full btn-primary bg-[#17191A] flex items-center justify-center gap-x-2.5 mt-4'
      >
        <Plus />
        {t('deposit')}
      </button>
      {openDeposit && (
        <Deposit
          organization={organization}
          onClose={() => setOpenDeposit(false)}
        />
      )}
    </div>
  )
}

export default Treasury
