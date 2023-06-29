import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { BigNumber, ethers } from 'ethers'
import { useWalletBalance, useWeb3 } from 'hooks'
import { Currency } from 'hooks/currency/types'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { Organization } from 'hooks/organization/types'
import { depositNative, depositToken } from 'hooks/treasury/functions'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

interface DepositProps {
  organization: Organization
  onClose: () => void
}

const AddressZero = ethers.constants.AddressZero

const Deposit = ({ organization, onClose }: DepositProps) => {
  const orgHasRewardToken = organization?.rewardToken !== AddressZero
  const [customToken, setCustomToken] = useState(orgHasRewardToken)
  const [amount, setAmount] = useState(0)
  const [tokenAddress, setTokenAddress] = useState(
    orgHasRewardToken ? organization?.rewardToken : AddressZero
  )

  let tokenList = organization.treasury?.tokens?.map((t) => t.token) || []
  tokenList = Array.from(new Set([...tokenList, AddressZero]))
  const { tokenInfos } = useTokenInfos(tokenList)
  const { account, library } = useWeb3()
  const [isTransacting, setIsTransacting] = useState(false)
  const walletBalance = useWalletBalance(tokenAddress)

  const processNative = async () => {
    await depositNative(
      organization.id,
      ethers.utils.parseEther(amount.toString()),
      account as string,
      library
    )
  }

  const processCustom = async (token: Currency) => {
    await depositToken(
      organization.id,
      ethers.utils.parseUnits(amount.toString(), token.decimal),
      token.address,
      account as string,
      library
    )
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const token = tokenInfos?.find((i) => i.address === tokenAddress)
    if (!token) {
      console.error('Deposit: invalid token')
      return
    }
    if (amount <= 0) {
      console.error('Deposit: amount is invalid')
      return
    }
    setIsTransacting(true)
    try {
      if (token.isNative) {
        await processNative()
      } else {
        await processCustom(token)
      }
      setAmount(0)
      setCustomToken(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsTransacting(false)
    }
  }

  const handleSelect = (e: any) => {
    let value = e.target.value
    if (value === 'newToken') {
      setCustomToken(true)
      setTokenAddress('')
      return
    }
    setCustomToken(false)
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

  const token = tokenInfos?.find((i) => i.address === tokenAddress)
  const balance = ethers.utils.formatEther(
    BigNumber.from(walletBalance || 0)?.toString()
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
            {t('deposit_funds')}
          </p>
        </div>

        <form className='w-full mt-5' onSubmit={handleSubmit}>
          <label className='block font-medium mt-6'>
            {t('choose_currency')}
          </label>
          <select
            className='input-base mt-2'
            value={customToken ? 'newToken' : tokenAddress}
            onChange={handleSelect}
          >
            {tokenList?.map((token) => {
              const tokenSymbol = tokenInfos?.find(
                (i) => i.address === token
              )?.symbol
              return (
                <option value={token} key={token}>
                  {tokenSymbol}
                </option>
              )
            })}
            <option value='newToken'>{t('new_token')}</option>
          </select>

          {customToken && (
            <div className='relative mt-4'>
              <label htmlFor='address' className='font-medium'>
                {t('token_contract_address')}
              </label>
              <div className='relative flex rounded-md bg-sky-600'>
                <div className='flex items-center px-4 text-white'>
                  {tokenInfos?.find((i) => i.address === tokenAddress)?.symbol}
                </div>
                <input
                  type='text'
                  id='address'
                  name='address'
                  placeholder='Token address'
                  required
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className='input-base w-full'
                />
              </div>
            </div>
          )}

          <div className='flex items-center justify-between gap-20 mt-4'>
            <label className='block font-medium'>{t('enter_amount')}</label>
            <p className='text-sm'>
              {t('balance')}:{' '}
              <span className='font-normal'>
                {parseFloat(balance).toFixed(4)} {token?.symbol}
              </span>
            </p>
          </div>
          <input
            type='number'
            id='amount'
            name='amount'
            min='0'
            step='0.000001'
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
            {isTransacting ? <Spinner className='fill-white' /> : t('deposit')}
          </button>
          <button onClick={onClose} className='w-full btn-outline mt-2'>
            {t('cancel')}
          </button>
        </form>
      </div>
    </>
  )
}

export default Deposit
