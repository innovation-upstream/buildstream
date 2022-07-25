import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export const getLibrary = (provider: any): Web3Provider => {
  return new Web3Provider(provider, 'any')
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className='relative sm:py-20 py-40' style={{ minHeight: '100vh' }}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Web3ReactProvider>
  )
}

export default MyApp
