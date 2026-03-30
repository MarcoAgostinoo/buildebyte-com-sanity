"use client";

import { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

/**
 * Gera componentes customizados para PortableText usado em posts
 */
export function generatePostPortableTextComponents(): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
      h1: ({ children }) => (
        <h1 className="text-4xl font-bold my-6 text-gray-900">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl font-bold my-5 text-gray-900">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-bold my-4 text-gray-900">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-bold my-3 text-gray-900">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-600 pl-6 my-6 italic text-gray-700 bg-blue-50 py-4 pr-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-4 ml-4 text-gray-700 space-y-2">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-4 ml-4 text-gray-700 space-y-2">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-gray-100 text-red-600 px-2 py-1 rounded font-mono text-sm">
          {children}
        </code>
      ),
      link: ({ value, children }) => {
        const { href, target } = value;
        return (
          <Link
            href={href}
            target={target || "_blank"}
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            {children}
          </Link>
        );
      },
    },
  };
}
