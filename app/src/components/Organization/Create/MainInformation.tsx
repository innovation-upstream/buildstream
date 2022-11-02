import Camera from 'SVGs/Camera'
import { useTranslation } from 'react-i18next'

const MainInformation = () => {
  const { t } = useTranslation('organization')

  return (
    <div className='mt-3.5'>
      <div className='text-center w-fit'>
        <label className='relative cursor-pointer flex flex-col items-center justify-center block rounded-full w-36 h-36 bg-[#F8F9FA]'>
          <Camera />
          <span className='mt-3 text-sm text-secondary'>{t('upload_logo')}</span>
          <input type='file' className='absolute w-0 h-0 invisible' />
        </label>
      </div>
      <label htmlFor='name' className='block mt-6 mb-2 text-sm'>
        {t('full_name_org')}
      </label>
      <input
        type='text'
        id='name'
        name='name'
        required
        placeholder={t('organization')}
        className='input-base'
      />
      <label htmlFor='description' className='block mt-6 mb-2 text-sm'>
        {t('short_description')}
      </label>
      <textarea
        id='description'
        name='description'
        required
        placeholder={t('info_about_self')}
        rows={5}
        className='input-base'
      />
      <label htmlFor='name' className='block mt-6 mb-2 text-sm'>
        {t('what_org_do')}
      </label>
      <select
        id='what_we_do'
        name='what_we_do'
        placeholder={t('organization')}
        className='input-base'
      >
        <option value='saas'>SaaS</option>
      </select>
    </div>
  )
}

export default MainInformation
