import Script from 'next/script'

export default function MobileTestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Mobile Debug v2
      </h1>

      <div
        id="raw-js-test"
        style={{
          padding: 16,
          background: '#d42020',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        RAW JS: NOT RUNNING
      </div>

      <button
        id="raw-btn"
        type="button"
        style={{
          padding: '20px 32px',
          background: '#54b9fd',
          color: '#000',
          border: 'none',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          marginBottom: 16,
        }}
      >
        TAP ME (raw JS)
      </button>

      <div
        id="tap-result"
        style={{
          padding: 16,
          background: '#181b2e',
          color: '#fff',
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        tap count: 0
      </div>

      <a
        href="/"
        style={{
          display: 'block',
          padding: '20px 32px',
          background: '#ddb837',
          color: '#000',
          fontSize: 18,
          fontWeight: 700,
          textAlign: 'center',
          textDecoration: 'none',
        }}
      >
        Go Home (plain link)
      </a>

      <Script id="raw-test" strategy="afterInteractive">{`
        (function() {
          var marker = document.getElementById('raw-js-test');
          if (marker) {
            marker.textContent = 'RAW JS: RUNNING';
            marker.style.background = '#22c55e';
          }
          var count = 0;
          var btn = document.getElementById('raw-btn');
          var result = document.getElementById('tap-result');
          if (btn && result) {
            btn.addEventListener('click', function() {
              count++;
              result.textContent = 'tap count: ' + count;
            });
            btn.addEventListener('touchend', function(e) {
              e.preventDefault();
              count++;
              result.textContent = 'tap count: ' + count + ' (touch)';
            });
          }
        })();
      `}</Script>
    </div>
  )
}
