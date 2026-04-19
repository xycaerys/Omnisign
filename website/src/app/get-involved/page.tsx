'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { ArrowRight, Building2, FlaskConical, HandHeart, Mail, User, Users } from 'lucide-react';
import FadeInSection from '@/components/FadeInSection';

const involvementOptions = [
  {
    icon: Building2,
    title: 'Pilot OmniSign',
    description:
      'Bring OmniSign into a hospital, school, campus service desk, or public-facing team that needs accessible communication support.',
    action: 'Plan a pilot',
  },
  {
    icon: FlaskConical,
    title: 'Research with us',
    description:
      'Collaborate on sign-language linguistics, human-centered evaluation, and deployment testing for real-world inclusive communication.',
    action: 'Join research',
  },
  {
    icon: Users,
    title: 'Advise the product',
    description:
      'We want feedback from deaf users, interpreters, educators, and accessibility leaders shaping how the platform grows.',
    action: 'Become an advisor',
  },
  {
    icon: HandHeart,
    title: 'Support the mission',
    description:
      'Help expand awareness, connect us with accessibility partners, and champion better communication access in your organization.',
    action: 'Start a conversation',
  },
];

export default function GetInvolvedPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('loading');

    window.setTimeout(() => {
      setFormStatus('success');
    }, 900);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(252,211,77,0.12),transparent_58%)]" />

      <section className="relative border-b border-white/6 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeInSection>
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-5 text-sm uppercase tracking-[0.34em] text-white/42">Get Involved</p>
              <h1 className="font-headline text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-white md:text-7xl">
                Help bring accessible conversation tools into the real world.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/66">
                OmniSign is strongest when it is shaped by the communities and institutions that
                need better communication access every day.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {involvementOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <FadeInSection key={option.title} delay={index * 0.08}>
                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{option.title}</h2>
                  <p className="mt-4 text-base leading-8 text-white/62">{option.description}</p>
                  <button className="hero-secondary mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium">
                    {option.action}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/6 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-10 backdrop-blur-xl md:p-14">
          <FadeInSection>
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">Contact</p>
            <h2 className="mt-4 font-headline text-4xl font-medium text-white md:text-5xl">
              Tell us where OmniSign could make the biggest difference.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64">
              Whether you want to pilot the product, join research, or advise on inclusive design,
              we&apos;d love to hear how communication access shows up in your work.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/72">Full name</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/34" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-[24px] border border-white/8 bg-white/[0.05] py-4 pr-4 pl-11 text-white placeholder:text-white/32 focus:border-white/18 focus:outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/72">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/34" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@organization.com"
                    required
                    className="w-full rounded-[24px] border border-white/8 bg-white/[0.05] py-4 pr-4 pl-11 text-white placeholder:text-white/32 focus:border-white/18 focus:outline-none"
                  />
                </div>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/72">How can we work together?</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-[24px] border border-white/8 bg-white/[0.05] px-4 py-4 text-white focus:border-white/18 focus:outline-none"
                >
                  <option value="">Choose an option</option>
                  <option value="pilot">Pilot at my organization</option>
                  <option value="research">Research collaboration</option>
                  <option value="advisory">Product or accessibility advisory</option>
                  <option value="community">Community partnership</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="hero-secondary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-medium"
                >
                  {formStatus === 'loading' ? 'Sending...' : 'Schedule a Conversation'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {formStatus === 'success' ? (
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/72">
                Thanks for reaching out. OmniSign would love to explore the fit with you.
              </div>
            ) : null}
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
