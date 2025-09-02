import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const iframeRef = useRef(null);
  const [src, setSrc] = useState('/header/header.html');
  const [version] = useState(() => Date.now());

  useEffect(() => {
    function updateHeight() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        // Ensure "Locate Our Store" redirects to the desired URL in top window
        try {
          const storeLink = doc.querySelector('.store-block .c-link');
          if (storeLink && !storeLink.getAttribute('data-bound')) {
            storeLink.setAttribute('data-bound', '1');
            storeLink.setAttribute('role', 'link');
            storeLink.style.cursor = 'pointer';
            storeLink.addEventListener('click', function (e) {
              e.preventDefault();
              try {
                if (window && window.top) {
                  window.top.location.href = 'https://www.bluestone.com/store.html';
                } else {
                  window.location.href = 'https://www.bluestone.com/store.html';
                }
              } catch (_) {
                window.location.href = 'https://www.bluestone.com/store.html';
              }
            });
          }
        } catch (_) {
          // ignore
        }
        const headerEl = doc.querySelector('header');
        const h = (headerEl && headerEl.offsetHeight) || (doc.body && doc.body.offsetHeight) || 120;
        iframe.style.height = `${h}px`;
      } catch (_) {
        // cross-origin safety (shouldn't happen for /public assets)
      }
    }

    function chooseSrc() {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 425;
      const base = isMobile ? '/header/header-mobile.html' : '/header/header.html';
      setSrc(`${base}?v=${version}`);
    }

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', updateHeight);
    }
    const interval = setInterval(updateHeight, 500);
    chooseSrc();
    const onResize = () => { chooseSrc(); updateHeight(); };
    window.addEventListener('resize', onResize);

    return () => {
      if (iframe) iframe.removeEventListener('load', updateHeight);
      clearInterval(interval);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{
        width: '100%',
        height: '135px',
        border: 'none',
        overflow: 'hidden',
        display: 'block',
        lineHeight: 0,
        verticalAlign: 'top'
      }}
      scrolling="no"
      title="BlueStone Header"
    />
  );
}
