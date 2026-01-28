"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          build-e-byte
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/categorias" className="hover:underline">
              Categorias
            </Link>
          </li>
        </ul>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar posts..."
            className="px-2 py-1 rounded-l-md text-black"
          />
          <button type="submit" className="bg-blue-500 px-3 py-1 rounded-r-md hover:bg-blue-600">
            Buscar
          </button>
        </form>
      </nav>
    </header>
  );
}
