import { Link } from "@tanstack/react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://extensions.senchabot.com${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ol className="flex items-center space-x-2 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? "font-medium text-zinc-300" : ""}
                  aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
