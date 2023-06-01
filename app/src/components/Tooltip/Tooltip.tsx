import React, { useEffect } from 'react'

interface TooltipProps {
  children: React.ReactNode
  label?: React.ReactNode
  justify?: 'left' | 'right'
  align?: 'top' | 'bottom'
}

const Tooltip = ({
  children,
  label,
  justify = 'right',
  align = 'top',
}: TooltipProps) => {
  const [show, setShow] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mouseenter', () => setShow(true))
    element.addEventListener('mouseleave', () => setShow(false))

    return () => {
      element.removeEventListener('mouseenter', () => setShow(true))
      element.removeEventListener('mouseleave', () => setShow(false))
    }
  }, [ref])

  const alignClassName =
    align === 'top'
      ? 'md:-top-4 md:-translate-y-full bottom-auto'
      : 'md:-bottom-4 top-auto md:translate-y-full'
  const justifyClassName =
    justify === 'right' ? 'md:left-auto md:right-0' : 'md:left-0 md:right-auto'

  return (
    <div className='md:relative' ref={ref}>
      {label}
      {show && (
        <div
          className={`fixed md:absolute shadow-tooltip bg-[#F6F6F6] p-5 z-[52] rounded-2xl w-[80%] md:w-[380px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${justifyClassName} ${alignClassName} md:translate-x-0`}
        >
          {children}
        </div>
      )}
      {show && (
        <div
          onClick={() => setShow(false)}
          className='fixed md:hidden w-full h-full bg-black/40 inset-0 z-[51]'
        />
      )}
    </div>
  )
}

export default Tooltip
