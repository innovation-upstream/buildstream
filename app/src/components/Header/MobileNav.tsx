import ChevronDown from 'components/IconSvg/ChevronDown'
import CloseIcon from 'components/IconSvg/CloseIcon'
import MetamaskSvg from 'components/IconSvg/WalletSvg/MetamaskSvg'
import { useWeb3 } from 'hooks'
import { Organization } from 'hooks/organization/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { activeMenuItems } from './menuItems'

interface Props {
  close: () => void
  connectWallet: () => void
  organizations: Organization[]
}

const MobileNav = ({ close, connectWallet, organizations }: Props) => {
  const { account: address, deactivate } = useWeb3()
  const { pathname } = useRouter()
  const navMenu = activeMenuItems(pathname)
  const { t } = useTranslation('header')

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <nav className='w-[100vw] h-[100vh] z-10'>
      <section className='flex justify-between items-center shadow-sm shadow-gray-200 p-3 md:px-0'>
        <span className='block font-bold text-2xl'>
          <span className='block'>Menu</span>
        </span>
        <button
          className='p-3 border-gray-100 border-2 rounded-lg'
          onClick={close}
        >
          <CloseIcon />
        </button>
      </section>
      <section className='px-3'>
        <ul>
          {navMenu.map((menu) => (
            <Link href={menu.url} key={menu.label}>
              <li
                className='py-4 border border-t-0 border-r-0 border-l-0 text-[#686C6F] text-base font-semibold'
                onClick={close}
              >
                {t(menu.label)}
              </li>
            </Link>
          ))}
        </ul>
      </section>
      {!!organizations.length && (
        <section className='mt-6 px-3 text-primary'>
          <span className='font-bold text-lg'>Organizations</span>
          <ul>
            {organizations.map((org) => (
              <li
                key={org.id}
                className='py-4 border border-t-0 border-r-0 border-l-0 text-[#686C6F] text-base font-semibold'
                onClick={close}
              >
                <Link href={`/organization/${org.id}`}>{org.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className='mt-6 px-3 text-primary text-blue-700'>
        {address ? (
          <button
            className='border border-solid border-gray-200 inline-flex items-center justify-between py-3 px-4 gap-x-3 rounded-full text-sm w-full'
            onClick={disconnect}
          >
            <span className='block flex items-center gap-4'>
              <MetamaskSvg />
              <span className='text-sm text-black text-base font-semibold'>
                {address.substring(0, 6)}...
                {address.substring(address.length - 4)}
              </span>
            </span>
            <ChevronDown />
          </button>
        ) : (
          <button className='btn-outline w-full' onClick={connectWallet}>
            Connect your wallet
          </button>
        )}
      </section>
    </nav>
  )
}

export default MobileNav
