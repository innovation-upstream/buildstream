import CloseIcon from 'components/IconSvg/CloseIcon'
import { useEffect, useRef, useState } from 'react'
import Controls from 'SVGs/Controls'
import Find from 'SVGs/Find'
import Filter from './Filter'
import { useTaskFilter } from './FilterContext'

interface SearchProps {
  showControls?: boolean
}

const Search = ({ showControls }: SearchProps) => {
  const { updateFilters } = useTaskFilter()
  const [openControls, setOpenControls] = useState(false)
  const [controlMaxHeight, setControlMaxHeight] = useState(0)
  const controlRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = document.body
    if (!openControls) {
      body.style.overflow = 'auto'
      return
    }

    const top = controlRef?.current?.getBoundingClientRect()?.top || 0
    const windowHeight = window.innerHeight
    const height = windowHeight - top - 20
    setControlMaxHeight(height >= 0 ? height : 0)

    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = 'auto'
    }
  }, [openControls])

  return (
    <div className='relative'>
      <input
        className='input-base w-full rounded-[10px] pl-12'
        onChange={(e) => updateFilters?.({ text: e.target.value })}
      />
      <span className='absolute top-1/2 left-5 -translate-y-1/2'>
        <Find width={16} className='fill-[#B5B7BC]' />
      </span>
      {showControls && (
        <button
          onClick={() => setOpenControls((prev) => !prev)}
          className='absolute top-1/2 right-5 -translate-y-1/2'
        >
          <Controls />
        </button>
      )}
      {openControls && (
        <div
          ref={controlRef}
          className='bg-white overflow-auto md:bg-inherit p-4 pt-[107px] md:pt-0 md:p-0 fixed w-full h-[100vh] md:h-auto md:absolute md:w-3/5 top-0 md:top-full right-0 md:mt-4'
        >
          <div className='relative md:hidden'>
            <button
              onClick={() => setOpenControls(false)}
              className='absolute right-2.5 bottom-[26px]'
            >
              <CloseIcon />
            </button>
          </div>
          <Filter expand maxHeight={controlMaxHeight} />
        </div>
      )}
    </div>
  )
}

export default Search
