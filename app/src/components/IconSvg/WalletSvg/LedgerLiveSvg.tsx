import React from 'react'

const LedgerLiveSvg: React.FC<{ width?: number }> = ({ width = 36 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='0.5' y='0.5' width='35' height='35' rx='17.5' fill='#F4F5F8' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.8005 9H9V13.3125H10.0312V10.0312L15.8005 9.99709V9ZM15.8432 14.5743L15.8432 21.3748H20.1557V20.3436H16.8745L16.8403 14.5743H15.8432ZM9 27H15.8005V26.0029L10.0312 25.9688V22.6875H9V27ZM20.1993 9H26.9998V13.3125H25.9686V10.0312L20.1993 9.99709V9ZM26.9998 27H20.1993V26.0029L25.9686 25.9688V22.6875H26.9998V27Z'
        fill='#17191A'
      />
      <rect x='0.5' y='0.5' width='35' height='35' rx='17.5' stroke='#EFF0F1' />
    </svg>
  )
}

export default LedgerLiveSvg
