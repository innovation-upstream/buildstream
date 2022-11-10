import React from 'react'
import WalletsInfo from './wallets_info'
import CloseIcon from '../../IconSvg/CloseIcon'
import injected from 'config/Walletconnectors'
import { useWeb3 } from 'hooks'
import { useTranslation } from 'next-i18next'
import { IModalProps } from './interface'
import {
  ModalContent,
  ModalBody,
  ModalItemWrapper,
  ModalBackDrop
} from './styled'

const WalletModal: React.FC<IModalProps> = ({ show = false, toggleModal }) => {
  const { account: address, activate } = useWeb3()
  const { t } = useTranslation()

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  {
    return show ? (
      <div className='container flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-50'>
        <div className='relative w-full my-6 mx-auto z-50 max-w-[367px]'>
          <ModalContent>
            <div className='py-5 flex justify-between align-center'>
              <div></div>
              <div className='font-bold	text-xl'>
                {t('common:connect_wallet')}
              </div>
              <button onClick={toggleModal}>
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
                  {WalletsInfo.filter(
                    (walletInfo) => !walletInfo.available
                  ).map((wallet, index) => {
                    return (
                      <button
                        className='flex items-center font-semibold font-medium py-2 gap-x-3 rounded-lg hover:bg-blue-100 hover:-mx-3 hover:px-3 focus:bg-blue-100 focus:-mx-3 focus:px-3'
                        key={index}
                      >
                        {<wallet.icon />}
                        <span>{wallet.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </div>
        <ModalBackDrop onClick={toggleModal}></ModalBackDrop>
      </div>
    ) : null
  }
}

export default WalletModal
