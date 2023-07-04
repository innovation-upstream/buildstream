import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { BigNumber, ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { createWithdrawalAction } from 'hooks/action/functions'
import { Currency } from 'hooks/currency/types'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { Organization } from 'hooks/organization/types'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

interface WithdrawalProps {
  organization: Organization
  onClose: () => void
}

const AddressZero = ethers.constants.AddressZero

const Withdrawal = ({ organization, onClose }: WithdrawalProps) => {
  const [amount, setAmount] = useState(0)
  const [tokenAddress, setTokenAddress] = useState(
    organization?.rewardToken || AddressZero
  )
  const [recipient, setRecipientAddress] = useState('')

  const tokenList = organization.treasury?.tokens?.map((t) => t.token) || []
  const { tokenInfos } = useTokenInfos(tokenList)
  const { account, library } = useWeb3()
  const [isTransacting, setIsTransacting] = useState(false)

  const processWithdrawal = async (token: Currency) => {
    const withdrawAmount = token.isNative
      ? ethers.utils.parseEther(amount.toString())
      : ethers.utils.parseUnits(amount.toString(), token?.decimal)

    await createWithdrawalAction(
      organization.id,
      recipient,
      withdrawAmount,
      token.address,
      account as string,
      library.getSigner()
    )
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const token = tokenInfos?.find((i) => i.address === tokenAddress)
    if (!token) {
      console.error('Withdrawal: invalid token')
      return
    }
    if (!ethers.utils.isAddress(recipient)) {
      console.error('Withdrawal: invalid recipient')
      return
    }
    if (amount === 0) {
      console.error('Withdrawal: amount is 0')
      return
    }
    setIsTransacting(true)
    try {
      await processWithdrawal(token)
      setAmount(0)
      setRecipientAddress('')
    } catch (e) {
      console.error(e)
    } finally {
      setIsTransacting(false)
    }
    onClose()
  }

  const handleSelect = (e: any) => {
    let value = e.target.value
    setTokenAddress(value)
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  const { t } = useTranslation('organization')

  const tokenBalance = organization.treasury?.tokens?.find(
    (t) => t.token === tokenAddress
  )?.balance
  const token = tokenInfos?.find(i => i.address === tokenAddress)
  const balance = ethers.utils.formatUnits(
    BigNumber.from(tokenBalance || 0)?.toString(),
    token?.decimal
  )

  return (
    <>
      <div
        onClick={onClose}
        className='fixed w-full h-full bg-black/40 inset-0 z-10'
      />
      <div className='fixed paper px-20 py-8 max-w-[90%] z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative'>
          <button onClick={onClose} className='absolute top-0 -right-12'>
            <CloseIcon />
          </button>
          <p className='text-3xl text-center font-semibold'>
            {t('withdraw_funds')}
          </p>
        </div>

        <form className='w-full mt-5' onSubmit={handleSubmit}>
          <label className='block font-medium mt-6'>
            {t('choose_currency')}
          </label>
          <select
            className='input-base mt-2'
            value={tokenAddress}
            onChange={handleSelect}
          >
            {organization?.treasury?.tokens?.map((t) => {
              const tokenSymbol = tokenInfos?.find(
                (i) => i.address === t.token
              )?.symbol
              return (
                <option value={t.token} key={t.token}>
                  {tokenSymbol}
                </option>
              )
            })}
          </select>

          <div className='relative mt-4'>
            <label
              htmlFor='address'
              className='font-medium'
            >
              {t('recipient_address')}
            </label>
            <input
              type='text'
              id='address'
              name='address'
              placeholder={t('recipient_address')}
              required
              value={recipient}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className='input-base w-full'
            />
          </div>

          <div className='flex items-center justify-between gap-20 mt-4'>
            <label className='block font-medium'>{t('enter_amount')}</label>
            <p className='text-sm'>
              {t('balance')}: <span className='font-normal'>{balance} {token?.symbol}</span>
            </p>
          </div>
          <input
            type='number'
            id='amount'
            name='amount'
            required
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder='0.00'
            className='input-base'
          />

          <button
            type='submit'
            disabled={!organization.signers.includes(account as string)}
            className='w-full btn-primary mt-5'
          >
            {isTransacting ? <Spinner className='fill-white' /> : t('withdraw')}
          </button>
          <button onClick={onClose} className='w-full btn-outline mt-2'>
            {t('cancel')}
          </button>
        </form>
      </div>
    </>
  )
}

export default Withdrawal
