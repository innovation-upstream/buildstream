import injected from 'config/Walletconnectors'
import { setCookies } from 'cookies-next'
import { useWeb3 } from 'hooks'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import { checkNetwork } from 'utils/checkNetwork'
import CloseIcon from '../../IconSvg/CloseIcon'
import { IModalProps } from './interface'
import {
  ModalBackDrop,
  ModalBody,
  ModalContent,
  ModalItemWrapper
} from './styled'
import WalletsInfo from './wallets_info'

const ACCOUNT = 'account'

const WalletModal: React.FC<IModalProps> = ({ close, onConnect }) => {
  const { account: address, activate, library } = useWeb3()
  const { t } = useTranslation()

  async function connect() {
    try {
      await checkNetwork()
      await activate(injected)
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    if (address) {
      onConnect?.(address)
      setCookies(ACCOUNT, address)
      close()
    }
  }, [address])

  return (
    <div className='container flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-50'>
      <div className='relative w-full my-6 lg:my-auto mx-auto z-50 max-w-[367px]'>
        <ModalContent>
          <div className='py-5 flex justify-between align-center'>
            <div></div>
            <div className='font-bold	text-xl'>{t('common:connect_wallet')}</div>
            <button onClick={close}>
              <CloseIcon />
            </button>
          </div>
          <ModalBody>
            <ModalItemWrapper>
              <span className='block text-black-900 opacity-40 font-medium'>
                {t('common:ready_to_use')}
              </span>
              <div className='flex flex-col'>
                {WalletsInfo.filter((walletInfo) => walletInfo.available).map(
                  (wallet, index) => {
                    return (
                      <button
                        className='flex items-center font-semibold font-medium py-2 gap-x-3 rounded-lg hover:bg-blue-100 hover:-mx-3 hover:px-3 focus:bg-blue-100 focus:-mx-3 focus:px-3'
                        key={index}
                        onClick={connect}
                      >
                        {<wallet.icon />}
                        <span>{wallet.label}</span>
                      </button>
                    )
                  }
                )}
              </div>
            </ModalItemWrapper>
            <div>
              <span className='block text-black-900 opacity-40 font-medium'>
                {t('common:coming_soon')}
              </span>
              <div className='flex flex-col'>
                {WalletsInfo.filter((walletInfo) => !walletInfo.available).map(
                  (wallet, index) => {
                    return (
                      <button
                        className='flex items-center font-semibold font-medium py-2 gap-x-3 rounded-lg hover:bg-blue-100 hover:-mx-3 hover:px-3 focus:bg-blue-100 focus:-mx-3 focus:px-3'
                        key={index}
                      >
                        {<wallet.icon />}
                        <span>{wallet.label}</span>
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </div>
      <ModalBackDrop onClick={close}></ModalBackDrop>
    </div>
  )
}

export default WalletModal
