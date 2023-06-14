import DepositSVG from 'SVGs/Deposit'
import Withdraw from 'SVGs/Withdraw'
import Deposit from 'components/Deposit/Deposit'
import Withdrawal from 'components/Withdrawal/Withdrawal'
import { BigNumber, ethers } from 'ethers'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { Organization } from 'hooks/organization/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WalletProps {
  organization: Organization
}

const Wallet = ({ organization }: WalletProps) => {
  const tokens = organization?.treasury?.tokens
  const [selected, setSelected] = useState(tokens?.[0]?.token)
  const [openDeposit, setOpenDeposit] = useState(false)
  const [openWithdrawal, setOpenWithdrawal] = useState(false)
  const { t } = useTranslation('organization')

  const { tokenInfos } = useTokenInfos(tokens?.map((t) => t.token))
  const token = tokens?.find((t) => t.token === selected)
  const tokenInfo = tokenInfos?.find(i => i.address === selected)
  const balance = ethers.utils.formatUnits(
    BigNumber.from(token?.balance || 0)?.toString(),
    tokenInfo?.decimal
  )

  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>{t('wallet')}</p>

      <div className='p-4 bg-[#F8F9FA] rounded-md'>
        <p className='text-lg font-medium mb-4'>{t('total_tokens')}</p>
        <p className='text-3xl font-bold'>
          {balance}{' '}
          <span className='text-xl font-normal'>
            {tokenInfos?.find((i) => i.address === selected)?.symbol}
          </span>
        </p>
      </div>

      <p className='text-sm font-medium mt-6'>{t('choose_a_currency')}</p>
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

      <button
        type='button'
        onClick={() => setOpenWithdrawal(true)}
        className='w-full btn-primary flex items-center justify-center gap-x-2.5 mt-9'
      >
        <Withdraw />
        {t('withdrawal')}
      </button>
      <button
        type='button'
        onClick={() => setOpenDeposit(true)}
        className='w-full btn-primary bg-[#17191A] flex items-center justify-center gap-x-2.5 mt-4'
      >
        <DepositSVG />
        {t('deposit')}
      </button>
      {openDeposit && (
        <Deposit
          organization={organization}
          onClose={() => setOpenDeposit(false)}
        />
      )}
      {openWithdrawal && (
        <Withdrawal
          organization={organization}
          onClose={() => setOpenWithdrawal(false)}
        />
      )}
    </div>
  )
}

export default Wallet
