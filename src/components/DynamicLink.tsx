import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

/**
 * Renders an internal route link for admin-configured hrefs (arbitrary strings),
 * and a plain anchor for external URLs.
 */
export const DynamicLink: React.FC<{
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ href, className, onClick, children }) => {
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  const [path, query] = href.split('?');
  const search = query
    ? Object.fromEntries(new URLSearchParams(query).entries())
    : undefined;
  return (
    <Link to={(path || '/') as string} search={search as never} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export const useDynamicNavigate = () => {
  const navigate = useNavigate();
  return (href: string) => {
    if (/^(https?:)?\/\//.test(href)) {
      window.open(href, '_blank');
      return;
    }
    const [path, query] = href.split('?');
    const search = query ? Object.fromEntries(new URLSearchParams(query).entries()) : undefined;
    navigate({ to: (path || '/') as string, search: search as never });
  };
};
