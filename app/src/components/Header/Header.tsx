import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import WalletModal from 'components/Modals/WalletModal'
import { useWeb3 } from 'hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Hamburger from 'SVGs/Hamburger'
import ChevronDown from '../IconSvg/ChevronDown'
import Logo from '../IconSvg/Logo'
import { ConnectWalletButton, MenuLinkContainer, Navbar } from './styled'

const navMenu = [
  { label: 'about', url: '/' },
  { label: 'faq', url: '/' },
  { label: 'support', url: '/' }
]

const Header = () => {
  const { account: address, deactivate } = useWeb3()
  const { t } = useTranslation('header')
  const [showModal, setShowModal] = useState(false)

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <Navbar>
      <WalletModal
        show={showModal}
        toggleModal={() => setShowModal(!showModal)}
      />
      <div className='layout-container flex flex-wrap py-5 top-0 md:flex-row items-center justify-between md:justify-start'>
        <Link href='/'>
          <a>
            <Logo />
          </a>
        </Link>
        <button className='md:hidden'>
          <Hamburger />
        </button>
        <div className='ml-24 hidden md:flex flex-grow justify-between items-center'>
          <MenuLinkContainer>
            {navMenu.map((menu, index) => {
              return (
                <Link href={menu.url} key={index}>
                  <a>{t(menu.label)}</a>
                </Link>
              )
            })}
          </MenuLinkContainer>

          {address ? (
            <button
              className='btn-tag inline-flex items-center py-3 px-4 gap-x-3 rounded-full text-sm'
              onClick={disconnect}
            >
              <MetamaskSvg />
              <span className='text-sm'>
                {address.substring(0, 6)}...
                {address.substring(address.length - 4)}
              </span>
              <ChevronDown />
            </button>
          ) : (
            <ConnectWalletButton onClick={() => setShowModal(!showModal)}>
              Connect your wallet
            </ConnectWalletButton>
          )}
        </div>
      </div>
    </Navbar>
  )
}

export default Header
