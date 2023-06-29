import Hamburger from 'SVGs/Hamburger'
import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import WalletModal from 'components/Modals/WalletModal'
import injected from 'config/Walletconnectors'
import { getCookie, setCookies } from 'cookies-next'
import { useWeb3 } from 'hooks'
import useAuth from 'hooks/auth/useAuth'
import { Organization } from 'hooks/organization/types'
import { getUserOrganizations } from 'hooks/userstat/functions'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { checkNetwork } from 'utils/checkNetwork'
import { Converter } from 'utils/converter'
import ChevronDown from '../IconSvg/ChevronDown'
import Logo from '../IconSvg/Logo'
import MobileNav from './MobileNav'
import { activeMenuItems } from './menuItems'
import { ConnectWalletButton, Navbar } from './styled'

const ACCOUNT = 'account'

const Header = () => {
  const { account: address, deactivate, activate } = useWeb3()
  const { t } = useTranslation('header')
  const [showWalletModal, setWalletModal] = useState(false)
  const [showMobileNav, setModalNav] = useState(false)
  const { pathname } = useRouter()
  const navMenu = activeMenuItems(pathname)
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([])
  useAuth()

  const fetchUserOrganizations = async () => {
    const orgs = await getUserOrganizations(address as string)
    const organizations = [
      ...orgs.signerOrganizations,
      ...(orgs.approverOrganizations || [])
    ]
      .filter(
        (organization, index, array) =>
          array.findIndex((t) => t.id == organization.id) == index
      )
      .map((organization) => Converter.OrganizationFromQuery(organization))
    setUserOrganizations(organizations)
  }

  useEffect(() => {
    if (!address) {
      setUserOrganizations([])
      return
    }
    fetchUserOrganizations()
  }, [address])

  async function disconnect() {
    try {
      deactivate()
      setCookies(ACCOUNT, '')
    } catch (ex) {
      console.error(ex)
    }
  }

  async function detectNetwork() {
    if (getCookie(ACCOUNT)) {
      try {
        await checkNetwork()
        activate(injected)
      } catch (ex) {
        console.error(ex)
      }
    }
  }

  useEffect(() => {
    detectNetwork()
  }, [activate])

  useEffect(() => {
    if (address) {
      setCookies(ACCOUNT, address)
    }
  }, [address])

  return (
    <Navbar>
      {showWalletModal && <WalletModal close={() => setWalletModal(false)} />}
      {showMobileNav && (
        <MobileNav
          close={() => setModalNav(!showMobileNav)}
          connectWallet={() => setWalletModal(!showWalletModal)}
          organizations={userOrganizations}
        />
      )}
      <div className='layout-container flex flex-wrap py-5 top-0 md:flex-row items-center justify-between md:justify-start'>
        <Link href='/'>
          <a>
            <Logo />
          </a>
        </Link>
        <button
          className='md:hidden px-2 py-3 border-gray-100 border-2 rounded-lg'
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

          <ul className='flex flex-wrap items-center justify-center gap-x-7 text-base font-medium'>
            {userOrganizations.map((org) => (
              <li key={org.id} className={`font-semibold hover:text-gray-900`}>
                <Link href={`/organization/${org.id}`}>
                  <a
                    className={`${
                      pathname.includes('/organization') &&
                      pathname.endsWith(org.id.toString())
                        ? 'active:text-gray-900'
                        : 'text-[#686C6F]'
                    }`}
                  >
                    {org.name}
                  </a>
                </Link>
              </li>
            ))}
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
