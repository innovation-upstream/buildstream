import React from 'react'

const WalletConnect: React.FC<{ width?: number }> = ({ width = 36 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='36' height='36' rx='18' fill='#3B99FC' />
      <path
        d='M10.7867 13.3378C14.7705 9.35406 21.2294 9.35406 25.2132 13.3378L25.6927 13.8173C25.8918 14.0165 25.8918 14.3394 25.6927 14.5386L24.0525 16.1787C23.9529 16.2783 23.7915 16.2783 23.6919 16.1787L23.0321 15.5189C20.2529 12.7398 15.747 12.7398 12.9678 15.5189L12.2612 16.2255C12.1616 16.3251 12.0001 16.3251 11.9006 16.2255L10.2604 14.5854C10.0612 14.3862 10.0612 14.0633 10.2604 13.8641L10.7867 13.3378ZM28.6051 16.7298L30.0648 18.1895C30.264 18.3887 30.264 18.7116 30.0648 18.9108L23.4829 25.4928C23.2837 25.692 22.9608 25.692 22.7616 25.4928C22.7616 25.4928 22.7616 25.4928 22.7616 25.4928L18.0901 20.8214C18.0403 20.7716 17.9596 20.7716 17.9098 20.8214C17.9098 20.8214 17.9098 20.8214 17.9098 20.8214L13.2385 25.4928C13.0393 25.692 12.7163 25.692 12.5171 25.4928C12.5171 25.4928 12.5171 25.4928 12.5171 25.4928L5.93504 18.9107C5.73585 18.7115 5.73585 18.3886 5.93504 18.1894L7.39474 16.7297C7.59393 16.5305 7.91688 16.5305 8.11607 16.7297L12.7876 21.4012C12.8374 21.451 12.9181 21.451 12.9679 21.4012C12.9679 21.4012 12.9679 21.4012 12.9679 21.4012L17.6392 16.7297C17.8384 16.5305 18.1613 16.5305 18.3605 16.7297C18.3605 16.7297 18.3605 16.7297 18.3605 16.7297L23.032 21.4012C23.0818 21.451 23.1626 21.451 23.2124 21.4012L27.8838 16.7298C28.083 16.5306 28.4059 16.5306 28.6051 16.7298Z'
        fill='white'
      />
    </svg>
  )
}

export default WalletConnect
