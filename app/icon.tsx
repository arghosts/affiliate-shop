import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#4B3621', // Warna Coffee/Deep Brown
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%', // Membuat sudut tumpul (Squircle) enak dilihat di HP
        }}
      >
        {/* SVG Centang Emas (Golden Tick) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFD700" // Warna Emas (Gold)
          strokeWidth="4"   // Ketebalan garis (Tebal = Tegas)
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: '60%',
            height: '60%',
            filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' // Shadow halus biar 'pop'
          }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}