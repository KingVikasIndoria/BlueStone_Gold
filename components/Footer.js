import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const iframeRef = useRef(null);
  const [src, setSrc] = useState('/footer/footer.html');
  const [version] = useState(() => Date.now());

  useEffect(() => {
    function fitAndSize() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        const footerEl = doc.querySelector('footer') || doc.body;

        // Ensure no default margins cause horizontal scroll
        if (doc.documentElement) doc.documentElement.style.margin = '0';
        if (doc.body) doc.body.style.margin = '0';

        // Target width of the content inside the iframe (desktop markup often has fixed width)
        const contentWidth = footerEl.scrollWidth || doc.body.scrollWidth || iframe.clientWidth;
        const viewportWidth = iframe.clientWidth || iframe.parentElement?.clientWidth || window.innerWidth;

        // Scale down on small screens if content is wider than viewport
        let scale = 1;
        if (contentWidth > 0 && viewportWidth > 0 && contentWidth > viewportWidth) {
          scale = viewportWidth / contentWidth;
        }

        footerEl.style.transform = `scale(${scale})`;
        footerEl.style.transformOrigin = 'top left';
        footerEl.style.width = `${contentWidth}px`; // keep original layout width before scaling

        const rawHeight = (footerEl.offsetHeight || doc.body.offsetHeight || 200);
        const scaledHeight = Math.ceil(rawHeight * scale);
        iframe.style.height = `${scaledHeight}px`;
        iframe.style.width = '100%';
        iframe.style.overflow = 'hidden';
      } catch (_) {
        // ignore cross-origin issues (should not occur for /public assets)
      }
    }

    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener('load', fitAndSize);
    const interval = setInterval(fitAndSize, 500);
    setSrc(`/footer/footer.html?v=${version}`);
    window.addEventListener('resize', fitAndSize);
    return () => {
      if (iframe) iframe.removeEventListener('load', fitAndSize);
      clearInterval(interval);
      window.removeEventListener('resize', fitAndSize);
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


