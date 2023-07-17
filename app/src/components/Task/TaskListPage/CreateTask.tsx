import Plus from 'SVGs/Plus'
import WalletModal from 'components/Modals/WalletModal'
import { useWeb3 } from 'hooks'
import { getUserOrganizations } from 'hooks/userstat/functions'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const CreateTask = () => {
  const { account } = useWeb3()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('tasks')

  const create = async (address: string) => {
    const userOrganizations = await getUserOrganizations(address as string)
    let org
    if (
      userOrganizations.signerOrganizations.length > 1 ||
      userOrganizations.approverOrganizations.length > 1 ||
      userOrganizations.memberOrganizations.length > 1
    )
      return router.push('/organization')

    if (userOrganizations.signerOrganizations.length === 1)
      org = userOrganizations.signerOrganizations[0]
    else if (userOrganizations.approverOrganizations.length === 1)
      org = userOrganizations.approverOrganizations[0]
    else if (userOrganizations.memberOrganizations.length === 1)
      org = userOrganizations.memberOrganizations[0]
    else return router.push(`/organization/create`)

    router.push(`/organization/${org.id}?create=true`)
  }

  const handleClick = () => {
    if (!account) {
      setShowModal(true)
      return
    }
    create(account as string)
  }

  return (
    <>
      {showModal && (
        <WalletModal
          close={() => setShowModal(!showModal)}
          onConnect={create}
        />
      )}
      <div className='flex gap-4 items-center'>
        <button
          className='btn-outline flex justify-center gap-2.5 items-center min-w-full md:min-w-fit'
          onClick={handleClick}
        >
          <Plus className='fill-[#3667EA]' /> {t('add_task')}
        </button>
      </div>
    </>
  )
}

export default CreateTask
