'use client';

import { ArrowLeftRight, Brain, Camera, Languages, Mic, Smartphone } from 'lucide-react';
import FadeInSection from '@/components/FadeInSection';

const workflow = [
  {
    icon: Camera,
    title: 'See the signer',
    description:
      'Camera input captures movement, orientation, and timing so signed language can be understood in motion, not as isolated gestures.',
  },
  {
    icon: Languages,
    title: 'Translate for intent',
    description:
      'OmniSign maps sign language structure into natural text or speech while preserving meaning and conversational flow.',
  },
  {
    icon: Brain,
    title: 'Return expressive sign',
    description:
      'Replies from the hearing side are rendered back into accessible signed output through an expressive avatar layer.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Keep both sides in sync',
    description:
      'The full system is built for two-way exchanges, helping both participants stay engaged in the same live conversation.',
  },
];

const deployments = [
  'Front-desk communication for hospitals and clinics',
  'Classroom support for inclusive learning environments',
  'Public-service counters and intake desks',
  'Campus accessibility pilots and research labs',
];

export default function Features() {
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_55%)]" />

      <section className="relative border-b border-white/6 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeInSection>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-5 text-sm uppercase tracking-[0.34em] text-white/42">Features</p>
              <h1 className="font-headline text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
                OmniSign is built around live, two-way accessibility.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/66">
                Instead of treating accessibility as an add-on, the system is designed to translate
                speech, text, and sign as part of one continuous conversation loop.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <FadeInSection key={step.title} delay={index * 0.08}>
                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm uppercase tracking-[0.24em] text-white/36">
                      Step {index + 1}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{step.title}</h2>
                  <p className="mt-4 text-base leading-8 text-white/62">{step.description}</p>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/6 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeInSection>
            <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-10 backdrop-blur-xl md:p-14">
              <div className="flex items-center gap-3 text-white/40">
                <Mic size={18} />
                <span className="text-sm uppercase tracking-[0.24em]">Conversation loop</span>
              </div>
              <h2 className="mt-5 font-headline text-4xl font-medium text-white md:text-5xl">
                One system. Multiple communication surfaces.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
                OmniSign can listen to speech, read text, watch signed input, and return responses
                through accessible output. That makes it useful in environments where people need
                communication support without waiting for a separate workflow to begin.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="rounded-[36px] border border-white/10 bg-black/20 p-10 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3 text-white/40">
                <Smartphone size={18} />
                <span className="text-sm uppercase tracking-[0.24em]">Where it fits</span>
              </div>
              <div className="space-y-4">
                {deployments.map((item) => (
                  <div key={item} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm leading-7 text-white/68">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
