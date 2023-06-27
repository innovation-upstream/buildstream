import { useWeb3 } from 'hooks/helpers'
import { useEffect } from 'react'
import { authenticate, initiate, verify } from './functions'

const useAuth = () => {
  const { account, library } = useWeb3()

  const authenticateUser = async () => {
    if (!account) return
    const verifyResponse = await verify(account)
    if (verifyResponse.verified) return

    const initiateResponse = await initiate(account)
    const signer = library.getSigner()
    const signature = await signer.signMessage(initiateResponse.otp)
    await authenticate(account, signature)
  }

  useEffect(() => {
    if (!account) return
    authenticateUser()
  }, [account])
}

export default useAuth
