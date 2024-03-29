const CaretFilled = ({ width = 10, className = '' }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 10 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.86603 7.5C5.48113 8.16667 4.51887 8.16667 4.13397 7.5L0.669873 1.5C0.284973 0.833334 0.766099 0 1.5359 0L8.4641 0C9.2339 0 9.71503 0.833333 9.33013 1.5L5.86603 7.5Z'
        fill='#6BC5A1'
        className={className}
      />
    </svg>
  )
}

export default CaretFilled
