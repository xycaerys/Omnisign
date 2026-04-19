'use client';

import {
  Brain,
  Camera,
  MessageSquare,
  ScanFace,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import FadeInSection from '@/components/FadeInSection';

const technologyPillars = [
  {
    icon: Camera,
    title: 'Vision Capture',
    description:
      'OmniSign tracks hand shape, motion, posture, and timing so sign input is understood with the nuance required in live conversation.',
  },
  {
    icon: MessageSquare,
    title: 'Language Mapping',
    description:
      'Our translation layer bridges sign grammar with spoken and written language instead of flattening everything into literal word swaps.',
  },
  {
    icon: ScanFace,
    title: 'Expressive Avatar Output',
    description:
      'A signing avatar returns responses with rhythm, orientation, and facial emphasis so hearing-side speech can become accessible sign output.',
  },
  {
    icon: ShieldCheck,
    title: 'Deployment Ready',
    description:
      'The stack is designed for schools, hospitals, and public-service environments where uptime, privacy, and clarity matter.',
  },
];

const principles = [
  {
    icon: Waves,
    title: 'Accessibility first',
    copy:
      'We design for communication access, not just technical novelty. Every workflow starts with the needs of deaf users in shared spaces.',
  },
  {
    icon: Brain,
    title: 'Context matters',
    copy:
      'Meaning changes with tone, pace, and setting. OmniSign is built to preserve intent across two-way interactions, not just single phrases.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for trust',
    copy:
      'Hospitals, campuses, and frontline services need systems people can rely on. We prioritize clarity, transparency, and repeatable performance.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_58%)]" />

      <section className="relative border-b border-white/6 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeInSection>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-5 text-sm uppercase tracking-[0.34em] text-white/42">Technology</p>
              <h1 className="font-headline text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
                Built for real conversations between deaf and hearing people.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[hsl(var(--hero-sub))]/85">
                OmniSign combines computer vision, language modeling, and expressive avatar output
                to support live two-way communication in the places where access matters most.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {technologyPillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <FadeInSection key={pillar.title} delay={index * 0.08}>
                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{pillar.title}</h2>
                  <p className="mt-4 text-base leading-8 text-white/62">{pillar.description}</p>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/6 px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-10 backdrop-blur-xl md:p-14">
          <FadeInSection>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/40">Why we exist</p>
                <h2 className="mt-4 font-headline text-4xl font-medium leading-tight text-white md:text-5xl">
                  Communication access should feel native, not exceptional.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
                  We are building OmniSign for reception desks, classrooms, clinics, and service
                  counters where people shouldn&apos;t need to wait for access. The goal is simple:
                  let both sides of a conversation stay present while the system handles translation.
                </p>
              </div>

              <div className="space-y-4">
                {principles.map((principle) => {
                  const Icon = principle.icon;

                  return (
                    <div
                      key={principle.title}
                      className="rounded-[28px] border border-white/8 bg-black/20 p-6"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-white" size={18} />
                        <h3 className="text-lg font-semibold text-white">{principle.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/62">{principle.copy}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
