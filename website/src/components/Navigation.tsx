'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.svg';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'Technology' },
  { href: '/get-involved', label: 'Partners' },
  { href: '/get-involved', label: 'Community', hasChevron: true },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(7,4,18,0.72)] backdrop-blur-[22px]">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center">
            <Image src={logo} alt="OmniSign" className="h-8 w-auto" priority />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-white/68 transition-colors hover:text-white"
              >
                <span>{link.label}</span>
                {link.hasChevron ? <ChevronDown size={15} /> : null}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="hero-secondary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
              >
                OmniSign
              </Link>
            </motion.div>
          </div>

          <button
            onClick={() => setIsOpen((open) => !open)}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}-mobile`}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-white/72 transition hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="hero-secondary block rounded-full px-4 py-3 text-center text-sm font-medium"
            >
              OmniSign
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
