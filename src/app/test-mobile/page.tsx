export default function MobileTestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Mobile Debug v4
      </h1>

      <div id="inline-js" style={{
        padding: 12, background: '#d42020', color: '#fff',
        fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 8,
      }}>
        Inline JS: waiting...
      </div>

      <div id="bundle-test" style={{
        padding: 12, background: '#d42020', color: '#fff',
        fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 8,
      }}>
        Next.js bundles: waiting...
      </div>

      <div id="react-test" style={{
        padding: 12, background: '#d42020', color: '#fff',
        fontSize: 14, fontWeight: 700, textAlign: 'center', marginBottom: 8,
      }}>
        React hydration: waiting...
      </div>

      <div id="error-log" style={{
        padding: 12, background: '#181b2e', color: '#fd4682',
        fontSize: 11, marginBottom: 16, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      }}>
        Errors will appear here...
      </div>

      <button id="raw-btn" type="button" style={{
        padding: '20px 32px', background: '#54b9fd', color: '#000',
        border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer',
        display: 'block', width: '100%', marginBottom: 16,
      }}>
        TAP ME (raw JS)
      </button>

      <div id="tap-result" style={{
        padding: 12, background: '#181b2e', color: '#fff',
        fontSize: 16, textAlign: 'center', marginBottom: 16,
      }}>
        tap count: 0
      </div>

      <a href="/" style={{
        display: 'block', padding: '16px 32px', background: '#ddb837',
        color: '#000', fontSize: 16, fontWeight: 700, textAlign: 'center',
        textDecoration: 'none',
      }}>
        Go Home
      </a>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var el = document.getElementById('inline-js');
          el.textContent = 'Inline JS: WORKING';
          el.style.background = '#22c55e';

          // Test tap
          var c = 0;
          document.getElementById('raw-btn').onclick = function() {
            c++;
            document.getElementById('tap-result').textContent = 'tap count: ' + c;
          };

          // Collect errors
          var errors = [];
          window.onerror = function(msg, src, line) {
            errors.push(msg + ' (' + src + ':' + line + ')');
            document.getElementById('error-log').textContent = errors.join('\\n');
          };

          // Test if Next.js bundles load
          var scripts = document.querySelectorAll('script[src*="/_next/"]');
          var bundleEl = document.getElementById('bundle-test');
          bundleEl.textContent = 'Found ' + scripts.length + ' Next.js scripts. Testing...';

          if (scripts.length === 0) {
            bundleEl.textContent = 'Next.js bundles: NONE FOUND';
            bundleEl.style.background = '#fd4682';
          } else {
            var tested = 0;
            var failed = 0;
            var firstSrc = scripts[0].src;

            // Try fetching the first bundle
            fetch(firstSrc, { method: 'HEAD' })
              .then(function(r) {
                if (r.ok) {
                  bundleEl.textContent = 'Bundles reachable (' + scripts.length + ' scripts, first: ' + r.status + ')';
                  bundleEl.style.background = '#22c55e';
                } else {
                  bundleEl.textContent = 'Bundle fetch failed: HTTP ' + r.status + ' for ' + firstSrc.split('/').pop();
                  bundleEl.style.background = '#fd4682';
                }
              })
              .catch(function(err) {
                bundleEl.textContent = 'Bundle fetch error: ' + err.message;
                bundleEl.style.background = '#fd4682';
              });
          }

          // Check React hydration after a delay
          setTimeout(function() {
            var reactEl = document.getElementById('react-test');
            if (window.__next_f || window.__NEXT_DATA__) {
              reactEl.textContent = 'React: Next.js runtime loaded';
              reactEl.style.background = '#22c55e';
            } else {
              reactEl.textContent = 'React: Next.js runtime NOT loaded';
              reactEl.style.background = '#fd4682';
            }
          }, 5000);
        })();
      ` }} />
    </div>
  )
}
