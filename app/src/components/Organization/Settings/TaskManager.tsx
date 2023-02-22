import { taskConnectors } from '../Create/taskConnectors'
import { useTranslation } from 'react-i18next'
import { Organization } from 'hooks/organization/types'
import Clickup from 'SVGs/Clickup'
import JiraSVG from 'SVGs/Jira'
import AsanaSvg from 'SVGs/Asana'
import OauthPopup from 'react-oauth-popup'
import { fetchToken } from 'integrations/clickup/api'

const client_id = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID
const redirect_uri = process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URL
const clickupUrl = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`

const TaskManager = ({ organization }: { organization: Organization }) => {
  const { t } = useTranslation('organization')

  const onCode = async (code: any, params?: any) => {
    await fetchToken(code, organization.id.toString())
  }

  return (
    <div className='paper'>
      <h3 className='font-semibold text-2xl mb-5'>
        {t('connect_task_manager')}
      </h3>

      <div className='flex flex-wrap gap-4'>
        <button
          type='button'
          className='flex items-center justify-center grow rounded-2xl px-5 h-40 basis-1/3 bg-white hover:bg-[#F8F9FA] focus:bg-[#F8F9FA] border border-[#EFF0F1]'
        >
          <OauthPopup
            url={clickupUrl}
            onCode={onCode}
            onClose={() => {}}
            title='Authenticate with Clickup'
            height={600}
            width={700}
          >
            <Clickup width={150} />
          </OauthPopup>
        </button>
        <button
          type='button'
          className='flex items-center justify-center grow rounded-2xl px-5 h-40 basis-1/3 bg-white hover:bg-[#F8F9FA] focus:bg-[#F8F9FA] border border-[#EFF0F1]'
        >
          <JiraSVG width={200} />
        </button>
        <button
          type='button'
          className='flex items-center justify-center grow rounded-2xl px-5 h-40 basis-1/3 bg-white hover:bg-[#F8F9FA] focus:bg-[#F8F9FA] border border-[#EFF0F1]'
        >
          <AsanaSvg width={150} />
        </button>
      </div>
    </div>
  )
}

export default TaskManager
