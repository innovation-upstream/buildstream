import { Organization } from 'hooks/organization/types'
import { useTranslation } from 'next-i18next'
import { Roles, rolesMap } from 'hooks/organization/types'
import Overflow from 'SVGs/Overflow'

interface IAdministratorListProps {
  organization: Organization
}

const adminInfo = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Dolor, lobortis auctor amet, sit amet. Nisl parturient nisl.
`

const AdministratorList = ({ organization }: IAdministratorListProps) => {
  const { t } = useTranslation('organization')

  const admins = Array.from(
    new Set([...organization.approvers, ...organization.signers])
  )
  const sortedAdmins = admins.sort()

  return (
    <div className='paper'>
      <h3 className='font-semibold text-2xl mb-5'>{t('administrators')}</h3>
      <p className='text-sm mt-2 text-[#646873] w-3/5'>{adminInfo}</p>

      <div className='rounded-[10px] bg-[#F5F7F9] py-5 px-6 mt-6'>
        <table className='w-full'>
          <thead className='border-b border-[#E7E7E8]/50'>
            <td className='text-sm py-3.5'>{t('address')}</td>
            <td className='text-sm py-3.5 pl-14'>{t('role')}</td>
          </thead>
          <tbody>
            {sortedAdmins.map((admin) => {
              const isSigner = organization.signers.includes(admin)
              const isApprover = organization.approvers.includes(admin)

              const roles = isSigner ? [t(rolesMap[Roles.SIGNER])] : [t(rolesMap[Roles.APPROVER])]
              if (isApprover) roles.push(t(rolesMap[Roles.APPROVER]))

              return (
                <tr key={admin} className='border-b border-[#E7E7E8]/50'>
                  <td className='w-[120px] font-semibold text-sm py-3.5'>
                    {admin?.substring(0, 10)}...
                    {admin?.substring(admin?.length - 7)}
                  </td>
                  <td className='relative text-xs py-3.5 pl-14 pr-5'>
                    {roles.toString()}
                    <button className='absolute right-0'>
                      <Overflow />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdministratorList
