import Link from 'next/link';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Renders a breadcrumb trail. If an item has an href it's rendered as a link; otherwise as plain text.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full px-2 lg:px-4 py-0">
      <ul className="flex items-center text-[10px] lg:text-xs tracking-wide space-x-2" style={{ fontFamily: 'Montserrat, Proxima Nova, Arial, sans-serif', textTransform: 'none' }}>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <li>
              {item.href ? (
                <Link href={item.href} className="hover:underline" style={{ color: '#2A7ABE' }}>
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium lg:font-semibold" style={{ color: '#2C2F5C' }}>{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && (
              <li aria-hidden="true" style={{ color: '#4D4D4D' }}>/</li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;


