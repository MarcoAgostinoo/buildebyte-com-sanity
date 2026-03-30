/**
 * ============================================================================
 * BREADCRUMB - Navegação de Contexto Hierárquico
 * ============================================================================
 * Exibe caminho: Home > Pilar > Categoria > Post
 */

import Link from "next/link";
import { FC } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // Se não houver href, será o item ativo
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm text-gray-500 mb-6 ${className}`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-400">/</span>}

          {item.href ? (
            <Link
              href={item.href}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
