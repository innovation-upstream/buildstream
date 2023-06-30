import ServerAuthModal from 'components/ServerAuthModal/ServerAuthModal'
import { authenticate, initiate, verify } from 'hooks/auth/functions'
import { useWeb3 } from 'hooks/helpers'
import { useRef, useState } from 'react'

type Props = {
  title?: string
  description?: string
  onError?: () => void
}

const useServerConfirmation = ({ title, description, onError }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const { account, library } = useWeb3()
  const actionFnRef =  useRef<null | (() => Promise<any>)>(null)
  const continueFnRef = useRef<null | (() => any)>(null)

  const reset = () => {
    actionFnRef.current = null
    continueFnRef.current = null
    setShowModal(false)
  }

  const authenticateUser = async () => {
    if (!account) throw new Error('Account not connected')

    try {
      const initiateResponse = await initiate(account)
      const signer = library.getSigner()
      const signature = await signer.signMessage(initiateResponse.otp)
      await authenticate(account, signature)
      await actionFnRef?.current?.()
      continueFnRef?.current?.()
    } catch (e) {
      onError?.()
    }
    reset()
  }

  const callAction = async (
    fn: () => Promise<any>,
    onContinue?: () => any
  ) => {
    if (!account) throw new Error('Account not connected')

    const verifyResponse = await verify(account)
    if (verifyResponse.verified) {
      await fn()
      onContinue?.()
      return
    }

    actionFnRef.current = fn
    continueFnRef.current = onContinue || null
    setShowModal(true)
  }

  return {
    callAction,
    component: showModal ? (
      <ServerAuthModal
        title={title}
        description={description}
        onRequest={authenticateUser}
        onClose={() => {
          reset()
          onError?.()
        }}
      />
    ) : null
  }
}

export default useServerConfirmation
