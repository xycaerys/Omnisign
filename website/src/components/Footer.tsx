'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageSquareMore, Users } from 'lucide-react';
import logo from '@/assets/logo.svg';

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(8,5,20,0.94)] py-14 text-white/55">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image src={logo} alt="OmniSign" className="h-8 w-auto" />
            <p className="mt-5 text-sm leading-7 text-white/58">
              OmniSign turns speech, text, and sign into fluid two-way conversations so deaf and
              hearing communities can access the same rooms, services, and opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/38">
              Product
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="/features" className="block transition hover:text-white">
                Translation Engine
              </Link>
              <Link href="/about" className="block transition hover:text-white">
                Technology Stack
              </Link>
              <Link href="/get-involved" className="block transition hover:text-white">
                Deployments
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/38">
              Use Cases
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <p>Hospitals and clinics</p>
              <p>Schools and campuses</p>
              <p>Public service counters</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/38">
              Connect
            </h3>
            <div className="mt-5 space-y-4 text-sm">
              <a href="mailto:hello@omnisign.io" className="flex items-center gap-3 transition hover:text-white">
                <Mail size={16} />
                hello@omnisign.io
              </a>
              <div className="flex items-center gap-3">
                <Users size={16} />
                Partner pilots open
              </div>
              <div className="flex items-center gap-3">
                <MessageSquareMore size={16} />
                Community research welcome
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 OmniSign. Designed for inclusive communication access.</p>
          <div className="flex gap-6 text-white/44">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="#" className="transition hover:text-white">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
