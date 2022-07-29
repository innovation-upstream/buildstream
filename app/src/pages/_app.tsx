import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import Spinner from 'components/Spinner/Spinner'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store, { wrapper } from 'state/store'
import '../styles/globals.css'

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
        setLoading(true)
    router.events.on('routeChangeStart', handleChange(true))
    router.events.on('routeChangeComplete', handleChange())

    // eslint-disable-next-line consistent-return
    return () => {
      router.events.off('routeChangeStart', handleChange(true))
      router.events.off('routeChangeComplete', handleChange())
    }
  }, [router])

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <div className='relative sm:py-20 py-40' style={{ minHeight: '100vh' }}>
          <Header />
          {loading ? (
            <div className='absolute top-1/2 right-1/2 translate-y-1/2 translate-x-1/2'>
              <Spinner className='text-indigo-500' width={50} height={50} />
            </div>
          ) : (
            <Component {...pageProps} />
          )}
          <Footer />
        </div>
      </Provider>
    </Web3ReactProvider>
  )
}

export default wrapper.withRedux(WrappedApp)
