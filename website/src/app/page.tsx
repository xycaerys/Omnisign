'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  ChevronDown,
  Languages,
  ScanEye,
  Code,
} from 'lucide-react';
import InterpreterSpace from '@/components/InterpreterSpace';

const fadeBlurProps = {
  initial: { opacity: 0, filter: 'blur(12px)', y: 30 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' },
};

const NAV_ITEMS = [
  { label: 'Workflow', href: '#workflow', hasChevron: true },
  { label: 'Interpreter', href: '#interpreter' },
  { label: 'Deployments', href: '#deployments' },
  { label: 'Contact Us', href: '#contact' },
];

const BRANDS = ['Hospitals', 'Campuses', 'Clinics', 'Cities', 'Airports', 'Schools'];
const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

const WORKFLOW = [
  {
    icon: ScanEye,
    title: 'Capture signing in motion',
    description:
      'Camera input tracks hands, orientation, and movement so the system reads real signing instead of isolated gestures.',
  },
  {
    icon: Languages,
    title: 'Translate for meaning',
    description:
      'OmniSign maps between sign language structure and spoken or written language while preserving conversational intent.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Return accessible output',
    description:
      'Speech or text from the hearing side can be sent back as signed output, creating one continuous two-way loop.',
  },
];

const USE_CASES = [
  'Hospital intake desks and triage communication',
  'Campus advising, reception, and classroom access',
  'Public service counters and civic help desks',
  'Transport hubs, airports, and high-volume service points',
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    let frameId = 0;
    let replayTimeout: number | null = null;

    const stopLoop = () => {
      window.cancelAnimationFrame(frameId);
    };

    const step = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const currentTime = video.currentTime;
      const fadeDuration = 0.5;

      let opacity = 1;

      if (currentTime < fadeDuration) {
        opacity = currentTime / fadeDuration;
      } else if (duration > 0 && duration - currentTime < fadeDuration) {
        opacity = Math.max((duration - currentTime) / fadeDuration, 0);
      }

      video.style.opacity = `${opacity}`;
      frameId = window.requestAnimationFrame(step);
    };

    const startLoop = () => {
      stopLoop();
      frameId = window.requestAnimationFrame(step);
    };

    const playFromStart = () => {
      video.currentTime = 0;
      video.style.opacity = '0';

      const playPromise = video.play();
      if (playPromise instanceof Promise) {
        playPromise.catch(() => undefined);
      }
    };

    const handleEnded = () => {
      stopLoop();
      video.style.opacity = '0';

      replayTimeout = window.setTimeout(() => {
        playFromStart();
      }, 100);
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.style.opacity = '0';

    video.addEventListener('play', startLoop);
    video.addEventListener('pause', stopLoop);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', playFromStart, { once: true });

    if (video.readyState >= 2) {
      playFromStart();
    }

    return () => {
      stopLoop();

      if (replayTimeout) {
        window.clearTimeout(replayTimeout);
      }

      video.removeEventListener('play', startLoop);
      video.removeEventListener('pause', stopLoop);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <section className="relative min-h-screen overflow-hidden">
        {/* Restored Native Video Background with a reliable tech-loop fallback just in case */}
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={VIDEO_URL} type="video/mp4" />
          <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex min-h-screen flex-col">
          <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-6 lg:px-8">
            <nav className="w-full py-5">
              <div className="flex items-center justify-between gap-6 px-4 sm:px-2">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20">
                    <ScanEye className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">OmniSign</span>
                </Link>

                <div className="hidden items-center gap-8 lg:flex">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="inline-flex items-center gap-1 text-sm text-white/90 hover:text-white"
                    >
                      <span>{item.label}</span>
                      {item.hasChevron ? <ChevronDown className="h-4 w-4" /> : null}
                    </Link>
                  ))}
                </div>

                <Link
                  href="#interpreter"
                  className="hero-secondary rounded-full px-4 py-2 text-sm font-medium"
                >
                  Open Demo Space
                </Link>
              </div>

              <div className="mt-[3px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </nav>

            <div className="relative flex flex-1 items-center justify-center overflow-visible py-16">
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]" />

              <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
                <p className="mb-4 text-sm uppercase tracking-[0.34em] text-white/55">OmniSign</p>
                <h1 className="font-headline text-[clamp(5rem,16vw,13.75rem)] font-normal leading-[1.02] tracking-[-0.024em]">
                  <span className="text-[hsl(var(--foreground))]">Omni</span>
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)',
                    }}
                  >
                    Sign
                  </span>
                </h1>

                <p className="mt-[9px] max-w-xl text-lg leading-8 text-[hsl(var(--hero-sub))] opacity-80">
                  Real-time, two-way communication access
                  <br />
                  for deaf and hearing communities
                </p>

                <div className="mt-[25px] flex flex-col items-center gap-4 sm:flex-row">
                  <Link
                    href="#interpreter"
                    className="hero-secondary rounded-full px-[29px] py-[24px] text-base font-medium"
                  >
                    Launch Interpreter Space
                  </Link>
                </div>
              </div>
            </div>

            <div className="pb-10">
              <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
                <div className="shrink-0 text-sm leading-6 text-white/50">
                  Designed for access
                  <br />
                  across essential spaces
                </div>

                <div className="overflow-hidden">
                  <div
                    className="flex w-max min-w-full items-center gap-16"
                    style={{ animation: 'marquee-scroll 20s linear infinite' }}
                  >
                    {[...BRANDS, ...BRANDS].map((brand, index) => (
                      <div key={`${brand}-${index}`} className="flex shrink-0 items-center gap-3">
                        <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-white">
                          {brand[0]}
                        </div>
                        <span className="text-base font-semibold text-[hsl(var(--foreground))]">
                          {brand}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section {...fadeBlurProps} id="workflow" className="relative border-t border-white/6 px-6 py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-white/42">Workflow</p>
            <h2 className="mt-5 font-headline text-4xl font-medium tracking-[-0.03em] text-white md:text-6xl">
              A homepage with the product story, not just the hero.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/64">
              OmniSign is designed as a full communication layer: read sign input, translate for
              meaning, and send accessible output back into the conversation.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {WORKFLOW.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-white/62">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.div {...fadeBlurProps}>
        <InterpreterSpace />
      </motion.div>

      <motion.section {...fadeBlurProps} id="deployments" className="border-t border-white/6 px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.32em] text-white/40">Deployments</p>
            <h2 className="mt-5 font-headline text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl">
              Built for the spaces where communication delays matter.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/64">
              OmniSign is intended for real-world environments where people need immediate,
              respectful, accessible communication without waiting for a separate interpreter flow.
            </p>
          </div>

          <div className="grid gap-4">
            {USE_CASES.map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl"
              >
                <p className="text-base leading-8 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeBlurProps} className="border-t border-white/6 px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-10 text-center backdrop-blur-xl md:p-14">
          <p className="text-sm uppercase tracking-[0.32em] text-white/40">Next Step</p>
          <h2 className="mt-5 font-headline text-4xl font-medium tracking-[-0.03em] text-white md:text-6xl">
            The site now has room for the product, not just the pitch.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/64">
            Plug in your interpreter logic, live video components, and avatar rendering later, and
            this homepage will already support a full demo narrative for judges, partners, and users.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#interpreter"
              className="hero-secondary rounded-full px-8 py-4 text-base font-medium"
            >
              Jump to Interpreter Space
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-white/12 bg-black/20 px-8 py-4 text-base font-medium text-white/88 backdrop-blur-xl transition hover:bg-white/8"
            >
              Review the Full System
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeBlurProps} id="contact" className="border-t border-white/6 px-6 py-24 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-white/40">Contact Us</p>
          <h2 className="mt-5 font-headline text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl">
            View the Source Code
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/64">
            OmniSign is an open exploratory project. If you want to collaborate or adapt the code for your own hackathon or deployment, check out the repository.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="https://github.com/xycaerys"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 backdrop-blur-xl transition hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]"
            >
              <Code className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">
                github.com/xycaerys
              </span>
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
