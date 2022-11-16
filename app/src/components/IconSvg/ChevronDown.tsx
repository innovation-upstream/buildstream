import React from 'react'

const ChevronDown: React.FC<{ width?: number; className?: string }> = ({
  width = 24,
  className = ''
}) => {
  return (
    <svg
      width={width}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 15.9951C12.3418 15.9951 12.6289 15.8652 12.8955 15.5918L17.9541 10.417C18.1592 10.2119 18.2617 9.96582 18.2617 9.66504C18.2617 9.05664 17.7764 8.56445 17.1748 8.56445C16.8809 8.56445 16.6006 8.6875 16.375 8.91309L12.0068 13.4248L7.63184 8.91309C7.40625 8.6875 7.12598 8.56445 6.8252 8.56445C6.22363 8.56445 5.73828 9.05664 5.73828 9.66504C5.73828 9.95898 5.84082 10.2051 6.0459 10.417L11.1045 15.5918C11.3848 15.8721 11.665 15.9951 12 15.9951Z'
        fill='black'
        className={className}
      />
    </svg>
  )
}

export default ChevronDown
