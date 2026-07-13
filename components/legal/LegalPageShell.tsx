import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';

type LegalPageShellProps = {
  title: string;
  description: string;
  breadcrumbs: { name: string; url: string }[];
  children: React.ReactNode;
  mainClassName?: string;
  breadcrumbClassName?: string;
  breadcrumbSeparatorClassName?: string;
};

const LegalPageShell: React.FC<LegalPageShellProps> = ({
  title,
  description,
  breadcrumbs,
  children,
  mainClassName = 'bg-[#0B0B0B] text-[#F5F5F5]',
  breadcrumbClassName = 'text-white/60',
  breadcrumbSeparatorClassName = 'text-white/30',
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className={`min-h-screen ${mainClassName}`}>
      <SEO title={title} description={description} breadcrumbs={breadcrumbs} />
      <div className="mx-auto max-w-5xl px-6 py-20">
        <nav aria-label="Breadcrumb" className={`mb-10 text-sm ${breadcrumbClassName}`}>
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li key={`${crumb.name}-${crumb.url}`} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true" className={breadcrumbSeparatorClassName}>/</span> : null}
                  {isCurrent ? (
                    <span aria-current="page" className="text-[#0020BF]">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      to={crumb.url}
                      className="transition-colors duration-300 hover:text-[#0020BF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0020BF] rounded-sm"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <article className="space-y-10">
          {children}
        </article>
      </div>
    </main>
  );
};

export default LegalPageShell;