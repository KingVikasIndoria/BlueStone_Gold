import { useEffect, useState } from 'react';

// Usage notes:
// - Place your assets here: public/header/header.html, public/header/header.css, public/header/header.js
// - Then include <ExternalHeader /> at the top of any page to test the real header.

const ExternalHeader = () => {
  const [markup, setMarkup] = useState<string>('');
  const [scopedCss, setScopedCss] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    // Helper: prefix selectors so styles only apply under the header root
    function scopeCss(cssText: string, scope: string) {
      // Leave keyframes/import/font-face untouched
      // Prefix regular rules' selector lists with the scope
      return cssText
        .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // strip comments
        .replace(/(@keyframes[\s\S]*?\{[\s\S]*?\})/g, '__KEEP__$1__KEEP__')
        .replace(/(@font-face[\s\S]*?\{[\s\S]*?\})/g, '__KEEP__$1__KEEP__')
        .replace(/(@import[\s\S]*?;)/g, '__KEEP__$1__KEEP__')
        .replace(/([^}{@][^{]*?)\{/g, (m: string, selectors: string) => {
          // Handle comma-separated selector lists
          const prefixed = selectors
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
            .map((s: string) => `${scope} ${s}`)
            .join(', ');
          return `${prefixed} {`;
        })
        .replace(/__KEEP__/g, '');
    }

    async function loadAssets() {
      try {
        const [htmlRes, cssRes] = await Promise.all([
          fetch('/header/header.html'),
          fetch('/header/header.css'),
        ]);
        const html = htmlRes.ok ? await htmlRes.text() : '';
        const rawCss = cssRes.ok ? await cssRes.text() : '';
        if (!isMounted) return;
        setMarkup(html);
        setScopedCss(scopeCss(rawCss, '.external-header-root'));
      } catch (_) {
        // ignore
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="external-header-root">
      {scopedCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {/* Optional: if you need JS, keep it but be aware it may affect global DOM */}
      {/* <Script src="/header/header.js" strategy="afterInteractive" /> */}
    </div>
  );
};

export default ExternalHeader;
