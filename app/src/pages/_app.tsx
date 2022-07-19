import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'

export const getLibrary = (provider: any): Web3Provider => {
  return new Web3Provider(provider, 'any')
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </Web3ReactProvider>
  )
}

export default MyApp
