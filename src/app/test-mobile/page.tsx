export default function MobileTestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Mobile Debug v3
      </h1>

      {/* noscript: only shows if JavaScript is DISABLED in the browser */}
      <noscript>
        <div style={{
          padding: 16, background: '#ff0000', color: '#fff',
          fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 16,
        }}>
          JAVASCRIPT IS DISABLED IN YOUR BROWSER
        </div>
      </noscript>

      <div
        id="raw-js-test"
        style={{
          padding: 16, background: '#d42020', color: '#fff',
          fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 16,
        }}
      >
        JS STATUS: NOT RUNNING
      </div>

      <button
        id="raw-btn"
        type="button"
        style={{
          padding: '20px 32px', background: '#54b9fd', color: '#000',
          border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer',
          display: 'block', width: '100%', marginBottom: 16,
        }}
      >
        TAP ME
      </button>

      <div
        id="tap-result"
        style={{
          padding: 16, background: '#181b2e', color: '#fff',
          fontSize: 16, textAlign: 'center', marginBottom: 16,
        }}
      >
        tap count: 0
      </div>

      <a
        href="/"
        style={{
          display: 'block', padding: '20px 32px', background: '#ddb837',
          color: '#000', fontSize: 18, fontWeight: 700, textAlign: 'center',
          textDecoration: 'none',
        }}
      >
        Go Home
      </a>

      {/* Raw inline script - runs immediately, no React/Next.js dependency */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('raw-js-test').textContent = 'JS STATUS: RUNNING';
        document.getElementById('raw-js-test').style.background = '#22c55e';
        var c = 0;
        document.getElementById('raw-btn').onclick = function() {
          c++;
          document.getElementById('tap-result').textContent = 'tap count: ' + c;
        };
      ` }} />
    </div>
  )
}
