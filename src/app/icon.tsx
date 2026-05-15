import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#ddb837',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 900,
          color: '#1a181d',
          letterSpacing: '-0.04em',
          fontFamily: 'sans-serif',
        }}
      >
        SM
      </div>
    ),
    { ...size },
  )
}
