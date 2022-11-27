import { Organization } from 'hooks/organization/types'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Roles, rolesMap } from 'hooks/organization/types'
import AdministratorList from './AdministratorList'
import { useWeb3 } from 'hooks'
import { createAction } from 'hooks/action/functions'
import { ActionType } from 'hooks/action/types'

interface IAdministratorsProps {
  organization: Organization
}

const adminInfo = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Dolor, lobortis auctor amet, sit amet. Nisl parturient nisl.
`

const Administrators = ({ organization }: IAdministratorsProps) => {
  const { library } = useWeb3()
  const { t } = useTranslation('organization')
  const [userAddress, setUserAddress] = useState('')
  const [role, setRole] = useState<Roles>(Roles.APPROVER)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      if (role === Roles.APPROVER) {
        if (organization.approvers.includes(userAddress)) {
          throw new Error('User is already an approver')
        }
        await createAction(
          organization.id,
          userAddress,
          ActionType.ADD_APPROVER,
          library.getSigner()
        )
      } else {
        if (organization.signers.includes(userAddress)) {
          throw new Error('User is already an signer')
        }
        await createAction(
          organization.id,
          userAddress,
          ActionType.ADD_SIGNER,
          library.getSigner()
        )
      }
      setUserAddress('')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <div className='paper'>
        <h3 className='font-semibold text-2xl mb-5'>{t('administrators')}</h3>
        <p className='text-sm mt-2 text-[#646873] w-3/5'>{adminInfo}</p>
        <form className='mt-6' onSubmit={handleSubmit}>
          <label
            htmlFor='address'
            className='block mt-4 font-medium text-[#646873]'
          >
            {t('address')}
          </label>
          <input
            type='text'
            id='address'
            name='address'
            placeholder={t('address')}
            required
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value.toLowerCase())}
            className='input-base mt-2 w-full'
          />

          <label className='block font-medium mt-2 text-[#646873]'>
            {t('role')}
          </label>
          <select
            className='input-base mt-2'
            value={role}
            required
            onChange={(e) => setRole(Number(e.target.value))}
          >
            {Object.entries(rolesMap).map(([k, v]) => (
              <option value={k} key={k}>
                {t(v)}
              </option>
            ))}
          </select>

          <button type='submit' className='btn-primary px-10 mt-9'>
            {t('add')}
          </button>
        </form>
      </div>

      <div className='mt-4'>
        <AdministratorList organization={organization} />
      </div>
    </>
  )
}

export default Administrators
