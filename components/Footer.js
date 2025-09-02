import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const iframeRef = useRef(null);
  const [src, setSrc] = useState('/footer/footer.html');
  const [version] = useState(() => Date.now());

  useEffect(() => {
    function updateHeight() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        const footerEl = doc.querySelector('footer');
        const h = (footerEl && footerEl.offsetHeight) || (doc.body && doc.body.offsetHeight) || 200;
        iframe.style.height = `${h}px`;
      } catch (_) {
        // ignore cross-origin issues (should not occur for /public assets)
      }
    }

    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener('load', updateHeight);
    const interval = setInterval(updateHeight, 500);
    setSrc(`/footer/footer.html?v=${version}`);
    window.addEventListener('resize', updateHeight);
    return () => {
      if (iframe) iframe.removeEventListener('load', updateHeight);
      clearInterval(interval);
      window.removeEventListener('resize', updateHeight);
    };
  }, [version]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{
        width: '100%',
        height: '250px',
        border: 'none',
        display: 'block',
        overflow: 'hidden',
      }}
      scrolling="no"
      title="BlueStone Footer"
    />
  );
}


