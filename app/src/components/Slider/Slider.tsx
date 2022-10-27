import React, { useState, useRef, ReactNode } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { SliderProps } from './types'
import { StyledContentContainer } from './styled'
import 'react-circular-progressbar/dist/styles.css'
import Back from 'SVGs/Back'

const Slider = ({ onCancel, onComplete, titles, children }: SliderProps) => {
  const [active, setActive] = useState(0)
  const cardListRefs = useRef<any[]>([])
  const slideCount = React.Children.count(children)
  const activeTitle = titles?.find((t) => t.index === active)

  const gotoSlide = (index: number) => {
    const slide = cardListRefs.current[index] as HTMLElement
    slide.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    })
    setActive(index)
  }

  return (
    <div className='w-full'>
      <section>
        <div className='flex justify-between gap-x-10'>
          <p className='text-5xl font-bold'>{activeTitle?.title}</p>
          <div className='flex items-center gap-3 rounded-2xl h-fit p-4 bg-[#F5F7F9]'>
            <div className='text-end'>
              <p className='text-xl font-bold'>Step {active + 1}</p>
              <span className='mt-1 text-secondary whitespace-nowrap'>
                {activeTitle?.shortTitle || activeTitle?.title}
              </span>
            </div>
            <div className='w-16'>
              <CircularProgressbar
                value={((active + 1) / slideCount) * 100}
                text={`${active + 1}/${slideCount}`}
                className='font-bold'
                strokeWidth={12}
                styles={{
                  path: {
                    stroke: `#3667EA`,
                    strokeLinecap: 'butt'
                  },

                  trail: {
                    stroke: 'rgba(54, 103, 234, 0.12)',
                    strokeLinecap: 'butt'
                  },
                  text: {
                    fill: '#17191A',
                    fontSize: '16px'
                  }
                }}
              />
            </div>
          </div>
        </div>
        <StyledContentContainer
          className={`flex flex-nowrap overflow-auto scroll-smooth snap-mandatory touch-none gap-x-full`}
        >
          {React.Children.map(children, (child, index) => {
            return (
              <div
                ref={(ref) => (cardListRefs.current[index] = ref)}
                className='basis-full shrink-0'
                key={`slide-${index}`}
              >
                {child}
              </div>
            )
          })}
        </StyledContentContainer>
      </section>
      <section className='flex gap-5 mt-24'>
        {active < slideCount - 1 && (
          <button
            type='button'
            className='btn-primary px-20'
            onClick={() => gotoSlide(active + 1)}
          >
            Next
          </button>
        )}
        {active == slideCount - 1 && (
          <button
            type='submit'
            className='btn-primary px-20'
            onClick={onComplete}
          >
            Complete
          </button>
        )}
        {active > 0 && (
          <button
            type='button'
            className='flex items-center gap-x-3 btn-outline border-[#EFF0F1] hover:border-gray-500 focus:border-gray-500 px-16'
            onClick={() => gotoSlide(active - 1)}
          >
            <Back />
            Back
          </button>
        )}
        {active === 0 && onCancel && (
          <button
            type='button'
            className='btn-outline border-[#EFF0F1] hover:border-gray-500 focus:border-gray-500 px-16'
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </section>
    </div>
  )
}

export default Slider
