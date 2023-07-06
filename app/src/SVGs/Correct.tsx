const Correct = ({ width = 28, className = '' }) => {
  return (
    <svg
      viewBox='0 0 22 22'
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      className={className}
      aria-hidden='true'
      focusable='false'
    >
      <circle
        cx='11'
        cy='11'
        r='9.5'
        fill='none'
        stroke='none'
        strokeWidth='3'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9.68284 15.0426H9.67147C9.0348 15.0399 8.43818 14.7892 7.9899 14.3366L5.07666 11.4234L6.99049 9.50953L9.68284 12.2013L15.1201 6.76953L17.0328 8.68444L11.333 14.3783C10.8826 14.8092 10.3006 15.0426 9.68284 15.0426Z'
        fill='#C9C9C9'
        className={className}
      />
    </svg>
  )
}

export default Correct
