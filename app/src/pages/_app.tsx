import { ApolloProvider } from '@apollo/client'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Spinner from 'components/Spinner/Spinner'
import client from 'graphclient/client'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store, { wrapper } from 'state/store'
import '../styles/globals.css'
import ThemeProvider from '../theme/Theme.provider'

export const getLibrary = (provider: any): Web3Provider => {
  return new Web3Provider(provider, 'any')
}

function WrappedApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!router) return
    const handleChange =
      (state = false) =>
      () =>
        setLoading(state)
    router.events.on('routeChangeStart', handleChange(true))
    router.events.on('routeChangeComplete', handleChange())

    // eslint-disable-next-line consistent-return
    return () => {
      router.events.off('routeChangeStart', handleChange(true))
      router.events.off('routeChangeComplete', handleChange())
    }
  }, [router])

  return (
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeProvider>
            <div
              className='bg-[#F5F7F9] text-[#17191A] text-sm sm:text-base relative py-20'
              style={{ minHeight: '100vh' }}
            >
              <Header />
              <Toaster position='bottom-left' />
              {loading ? (
                <div className='absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2'>
                  <Spinner className='text-indigo-500' width={50} />
                </div>
              ) : (
                <Component {...pageProps} />
              )}
              <Footer />
            </div>
          </ThemeProvider>
        </Provider>
      </Web3ReactProvider>
    </ApolloProvider>
  )
}

export default appWithTranslation(wrapper.withRedux(WrappedApp))
