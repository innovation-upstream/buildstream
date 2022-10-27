import Camera from 'SVGs/Camera'

const MainInformation = () => {
  return (
    <div className='mt-3.5'>
      <div className='text-center w-fit'>
        <label className='relative cursor-pointer flex flex-col items-center justify-center block rounded-full w-36 h-36 bg-[#F8F9FA]'>
          <Camera />
          <span className='mt-3 text-sm text-secondary'>Upload logo</span>
          <input type='file' className='absolute w-0 h-0 invisible' />
        </label>
      </div>
      <label htmlFor='name' className='block mt-6 mb-2 text-sm'>
        Full name of organization
      </label>
      <input
        type='text'
        id='name'
        name='name'
        required
        placeholder='Organization'
        className='input-base'
      />
      <label htmlFor='description' className='block mt-6 mb-2 text-sm'>
        Short description about organization
      </label>
      <textarea
        id='description'
        name='description'
        required
        placeholder='Add some actual iunformation about yourself '
        rows={5}
        className='input-base'
      />
      <label htmlFor='name' className='block mt-6 mb-2 text-sm'>
        What does organization do
      </label>
      <select
        id='what_we_do'
        name='what_we_do'
        placeholder='Organization'
        className='input-base'
      >
        <option value='saas'>SaaS</option>
      </select>
    </div>
  )
}

export default MainInformation
