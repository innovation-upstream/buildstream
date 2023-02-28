import { useEffect } from 'react'
import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import WalletModal from 'components/Modals/WalletModal'
import { useWeb3 } from 'hooks'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Hamburger from 'SVGs/Hamburger'
import ChevronDown from '../IconSvg/ChevronDown'
import Logo from '../IconSvg/Logo'
import MobileNav from './MobileNav'
import { ConnectWalletButton, Navbar } from './styled'
import { useRouter } from 'next/router'
import { activeMenuItems } from './menuItems'
import { setCookies, getCookie } from 'cookies-next'
import injected from 'config/Walletconnectors'

const Header = () => {
  const { account: address, deactivate, activate } = useWeb3()
  const { t } = useTranslation('header')
  const [showWalletModal, setWalletModal] = useState(false)
  const [showMobileNav, setModalNav] = useState(false)
  const { pathname } = useRouter()
  const navMenu = activeMenuItems(pathname)

  const ACCOUNT = 'account'

  async function disconnect() {
    try {
      deactivate()
      setCookies(ACCOUNT, '')
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (getCookie(ACCOUNT)) {
      try {
        activate(injected)
      } catch (ex) {
        console.log(ex)
      }
    }
  }, [activate])

  return (
    <Navbar>
      {showWalletModal && <WalletModal close={() => setWalletModal(false)} />}
      {showMobileNav && (
        <MobileNav
          close={() => setModalNav(!showMobileNav)}
          connectWallet={() => setWalletModal(!showWalletModal)}
        />
      )}
      <div className='layout-container flex flex-wrap py-5 top-0 md:flex-row items-center justify-between md:justify-start'>
        <Link href='/'>
          <a>
            <Logo />
          </a>
        </Link>
        <button
          className='lg:hidden px-2 py-3 border-gray-100 border-2 rounded-lg'
          onClick={() => setModalNav(!showMobileNav)}
        >
          <Hamburger />
        </button>
        <div className='ml-24 hidden md:flex flex-grow justify-between items-center'>
          <ul className='flex flex-wrap items-center justify-center gap-x-7 text-base font-medium'>
            {navMenu.map((menu, index) => {
              return (
                <li key={index} className={`font-semibold hover:text-gray-900`}>
                  <Link href={menu.url}>
                    <a
                      className={`${
                        pathname.includes(menu.url)
                          ? 'active:text-gray-900'
                          : 'text-[#686C6F]'
                      }`}
                    >
                      {t(menu.label)}
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>

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
            <ConnectWalletButton
              onClick={() => setWalletModal(!showWalletModal)}
            >
              Connect your wallet
            </ConnectWalletButton>
          )}
        </div>
      </div>
    </Navbar>
  )
}

export default Header
