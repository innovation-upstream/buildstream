import MetamaskModalSvg from 'components/IconSvg/WalletSvg/MetamaskModalSvg'
import WalletConnect from 'components/IconSvg/WalletSvg/WalletConnect'
import CoinbaseSvg from 'components/IconSvg/WalletSvg/CoinbaseSvg'
import ArgentSvg from 'components/IconSvg/WalletSvg/ArgentSvg'
import TrustSvg from 'components/IconSvg/WalletSvg/TrustSvg'
import LedgerLiveSvg from 'components/IconSvg/WalletSvg/LedgerLiveSvg'
import ImWalletSvg from 'components/IconSvg/WalletSvg/ImWalletSvg'
import SteakWalletSvg from 'components/IconSvg/WalletSvg/SteakWalletSvg'


const WalletsInfo = [
  {
    icon: MetamaskModalSvg,
    label: 'MetaMask',
    available: true
  },
    {
      icon: WalletConnect,
      label: 'WalletConnect',
      available: false
    },
    {
      icon: CoinbaseSvg,
      label: 'Coinbase Wallet',
      available: false
    },
    {
      icon: ArgentSvg,
      label: 'Argent',
      available: false
    },
    {
      icon: TrustSvg,
      label: 'Trust',
      available: false
    },
    {
      icon: LedgerLiveSvg,
      label: 'Ledger Live',
      available: false
    },
    {
      icon: ImWalletSvg,
      label: 'imWallet',
      available: false
    },
    {
      icon: SteakWalletSvg,
      label: 'SteakWallet',
      available: false
    }
]

export default WalletsInfo