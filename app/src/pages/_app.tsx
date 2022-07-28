import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store, { wrapper } from 'state/store'
import '../styles/globals.css'

export const getLibrary = (provider: any): Web3Provider => {
  return new Web3Provider(provider, 'any')
}

function WrappedApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <div className='relative sm:py-20 py-40' style={{ minHeight: '100vh' }}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </Provider>
    </Web3ReactProvider>
  )
}

export default wrapper.withRedux(WrappedApp)
