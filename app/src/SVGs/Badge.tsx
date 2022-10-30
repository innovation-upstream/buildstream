const Badge = ({ width = 24 }) => {
  return (
    <svg
      width={width}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_i_344_5046)'>
        <rect x='5' y='5' width='14' height='14' rx='7' fill='#FFB213' />
      </g>
      <g filter='url(#filter1_i_344_5046)'>
        <rect
          x='6.75'
          y='6.75'
          width='10.5'
          height='10.5'
          rx='5.25'
          fill='#FFA327'
        />
      </g>
      <g filter='url(#filter2_ddi_344_5046)'>
        <path
          d='M15.3866 10.9584L13.2532 10.655L12.2995 8.76306C12.2735 8.71126 12.2306 8.66932 12.1777 8.64384C12.0449 8.5797 11.8836 8.63315 11.8172 8.76306L10.8635 10.655L8.73005 10.9584C8.67123 10.9666 8.61746 10.9937 8.57628 11.0348C8.52651 11.0849 8.49908 11.1522 8.50002 11.2221C8.50097 11.2919 8.53021 11.3585 8.58132 11.4073L10.1249 12.8799L9.76022 14.9592C9.75167 15.0076 9.75714 15.0573 9.77601 15.1028C9.79488 15.1483 9.8264 15.1877 9.86699 15.2166C9.90758 15.2454 9.95562 15.2625 10.0057 15.266C10.0557 15.2695 10.1057 15.2592 10.1501 15.2363L12.0584 14.2546L13.9666 15.2363C14.0187 15.2634 14.0792 15.2725 14.1372 15.2626C14.2834 15.238 14.3817 15.1023 14.3565 14.9592L13.9918 12.8799L15.5354 11.4073C15.5774 11.367 15.6051 11.3144 15.6135 11.2568C15.6362 11.1129 15.5337 10.9797 15.3866 10.9584Z'
          fill='#FFBD36'
        />
      </g>
      <defs>
        <filter
          id='filter0_i_344_5046'
          x='5'
          y='5'
          width='14'
          height='14'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='BackgroundImageFix'
            result='shape'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='1.5' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0'
          />
          <feBlend
            mode='normal'
            in2='shape'
            result='effect1_innerShadow_344_5046'
          />
        </filter>
        <filter
          id='filter1_i_344_5046'
          x='6.75'
          y='6.75'
          width='10.5'
          height='10.5'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='BackgroundImageFix'
            result='shape'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'
          />
          <feBlend
            mode='normal'
            in2='shape'
            result='effect1_innerShadow_344_5046'
          />
        </filter>
        <filter
          id='filter2_ddi_344_5046'
          x='0.5'
          y='0.616699'
          width='23.1172'
          height='22.65'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_344_5046'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='0.5' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0'
          />
          <feBlend
            mode='normal'
            in2='effect1_dropShadow_344_5046'
            result='effect2_dropShadow_344_5046'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect2_dropShadow_344_5046'
            result='shape'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.758333 0 0 0 0 0.503289 0 0 0 0 0 0 0 0 0.12 0'
          />
          <feBlend
            mode='normal'
            in2='shape'
            result='effect3_innerShadow_344_5046'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default Badge
