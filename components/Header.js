import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const iframeRef = useRef(null);
  const [src, setSrc] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let resizeObserver = null;
    let resizeTimer = null;

    function updateHeight() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        try {
          const storeLink = doc.querySelector('.store-block .c-link');
          if (storeLink && !storeLink.getAttribute('data-bound')) {
            storeLink.setAttribute('data-bound', '1');
            storeLink.setAttribute('role', 'link');
            storeLink.style.cursor = 'pointer';
            try { storeLink.removeAttribute('onclick'); } catch (_) {}
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
        } catch (_) {}
        const headerEl = doc.querySelector('header') || doc.body;
        const h = (headerEl && headerEl.offsetHeight) || 120;
        iframe.style.height = `${h}px`;
      } catch (_) {}
    }

    function chooseSrc() {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 425;
      setSrc(isMobile ? '/header/header-mobile.html' : '/header/header.html');
    }

    function bindObservers() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        const target = doc.querySelector('header') || doc.body;
        if (target && 'ResizeObserver' in window) {
          resizeObserver = new ResizeObserver(() => updateHeight());
          resizeObserver.observe(target);
        }
      } catch (_) {}
      updateHeight();
    }

    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener('load', bindObservers);

    chooseSrc();

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        chooseSrc();
        updateHeight();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (iframe) iframe.removeEventListener('load', bindObservers);
      if (resizeObserver) resizeObserver.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!mounted || !src) {
    // Avoid desktop-first flash; reserve space to prevent layout shift
    return <div style={{ width: '100%', height: 64 }} />;
  }

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
      loading="eager"
    />
  );
}
