import Link from 'next/link'
import { getNgfContent, getItems } from '@/lib/ngf'
import ServiceCardGrid from '@/components/ServiceCardGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const content = await getNgfContent()

  // Brand
  const businessName = content['brand.businessName'] || 'West Michigan Window Tint'
  const tagline      = content['brand.tagline']      || 'Tinting West Michigan Since Day One'
  const phone        = content['brand.phone']        || '616.540.3107'
  const instagram    = content['brand.instagram']    || 'Westmiwindowtint'

  // Hero
  const heroChip        = content['hero.chip']          || 'West Michigan'
  const headlineLine1   = content['hero.headlineLine1'] || 'Premium Tint &'
  const headlineLine2   = content['hero.headlineLine2'] || 'Film Services'
  const heroDescription = content['hero.description']   ||
    'Auto tint, vinyl wrap, ambient lighting, and residential & commercial window film — Zach delivers clean, professional installs across West Michigan.'
  const heroCta = content['hero.cta'] || 'Get a Free Quote'

  // Services
  const servicesTitle    = content['services.title']    || 'What We Do'
  const servicesSubtitle = content['services.subtitle'] || 'Professional film and lighting installs for vehicles, homes, and businesses.'
  const rawServices = getItems(content, 'services.items')
  const services = rawServices.length > 0 ? rawServices : [
    {
      name: 'Automobile Tint',
      desc: 'Block heat, cut glare, and protect your interior with precision-cut window film on any vehicle. We tint sedans, trucks, SUVs, and everything in between — with a clean, bubble-free finish every time.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=280&fit=crop&q=80',
    },
    {
      name: 'Residential & Commercial',
      desc: 'Reduce energy costs, improve privacy, and block harmful UV rays with professional window film for your home or business. Great for offices, storefronts, and residential windows of any size.',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=280&fit=crop&q=80',
    },
    {
      name: 'Vinyl Wrap',
      desc: 'Full vehicle wraps, partial color changes, and paint protection film. Whether you want to stand out or protect your factory finish, we cut and install every wrap by hand for a seamless look.',
      image: '/vinyl-wrap.webp',
    },
    {
      name: 'Ambient Lighting',
      desc: 'Custom interior LED accent lighting that transforms your cabin at night. We run clean wiring and mount lights where they belong — no dangling strips, no visible wires.',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=280&fit=crop&q=80',
    },
  ]
  const serviceIcons = ['01', '02', '03', '04']

  // Why Choose Us
  const whyTitle   = content['why.title'] || 'Why Choose Us'
  const rawReasons = getItems(content, 'why.items')
  const reasons    = rawReasons.length > 0 ? rawReasons : [
    { heading: 'Precision Installs',  body: 'Every job is cut and applied by hand for a clean, bubble-free finish that lasts.' },
    { heading: 'Premium Film Only',   body: 'We use professional-grade film exclusively. Your investment deserves quality materials that hold up long-term.' },
    { heading: 'Fast Turnaround',     body: 'Most auto tints are done same-day. Get your car in and out without the wait.' },
    { heading: 'Local & Accountable', body: 'You talk directly to Zach — not a call center. If something is not right, he will make it right.' },
  ]

  // Bottom CTA
  const ctaTitle       = content['cta.title']       || 'Ready to book your install?'
  const ctaDescription = content['cta.description'] || 'Fill out a quick quote form and Zach will get back to you fast.'
  const ctaButton      = content['cta.button']      || 'Get a Free Quote'

  // Footer
  const copyright = content['footer.copyright'] || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`

  return (
    <div className="min-h-screen">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: 'var(--line)', backgroundColor: 'rgba(10,10,10,0.85)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex flex-col leading-none">
            <span
              data-ngf-field="brand.businessName"
              data-ngf-label="Business Name"
              data-ngf-type="text"
              data-ngf-section="Brand"
              className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--text)]"
            >
              {businessName}
            </span>
            <span
              data-ngf-field="brand.tagline"
              data-ngf-label="Tagline"
              data-ngf-type="text"
              data-ngf-section="Brand"
              className="text-[10px] font-medium uppercase tracking-[0.12em]"
              style={{ color: 'var(--gold)' }}
            >
              {tagline}
            </span>
          </div>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="#services" className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--text)] transition-colors">Services</Link>
            <Link href="#about" className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--text)] transition-colors">Our Work</Link>
            <Link href="#why" className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--text)] transition-colors">About</Link>
            <Link href="/quote" className="btn-gold text-xs">Get a Quote</Link>
          </nav>
          <Link href="/quote" className="btn-gold text-xs sm:hidden">Quote</Link>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(200,168,75,0.12), transparent 70%)' }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <span
            data-ngf-field="hero.chip"
            data-ngf-label="Eyebrow Tag"
            data-ngf-type="text"
            data-ngf-section="Hero"
            className="gold-chip"
          >
            {heroChip}
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl">
            <span
              data-ngf-field="hero.headlineLine1"
              data-ngf-label="Headline Line 1"
              data-ngf-type="text"
              data-ngf-section="Hero"
            >
              {headlineLine1}
            </span>
            <br />
            <span
              data-ngf-field="hero.headlineLine2"
              data-ngf-label="Headline Line 2"
              data-ngf-type="text"
              data-ngf-section="Hero"
              style={{ color: 'var(--gold)' }}
            >
              {headlineLine2}
            </span>
          </h1>
          <p
            data-ngf-field="hero.description"
            data-ngf-label="Description"
            data-ngf-type="textarea"
            data-ngf-section="Hero"
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--muted)' }}
          >
            {heroDescription}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/quote" className="btn-gold w-full sm:w-auto">
              <span
                data-ngf-field="hero.cta"
                data-ngf-label="Button Text"
                data-ngf-type="text"
                data-ngf-section="Hero"
              >
                {heroCta}
              </span>
            </Link>
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="btn-outline w-full sm:w-auto">
              <span
                data-ngf-field="brand.phone"
                data-ngf-label="Phone Number"
                data-ngf-type="text"
                data-ngf-section="Brand"
              >
                {phone}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-20 sm:px-6" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2
              data-ngf-field="services.title"
              data-ngf-label="Section Title"
              data-ngf-type="text"
              data-ngf-section="Services"
              className="text-3xl font-bold text-[var(--text)] sm:text-4xl"
            >
              {servicesTitle}
            </h2>
            <p
              data-ngf-field="services.subtitle"
              data-ngf-label="Subtitle"
              data-ngf-type="text"
              data-ngf-section="Services"
              className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
              style={{ color: 'var(--muted)' }}
            >
              {servicesSubtitle}
            </p>
          </div>
          <ServiceCardGrid
            services={services}
            icons={serviceIcons}
            data-ngf-group="services.items"
            data-ngf-item-label="Service"
            data-ngf-min-items="1"
            data-ngf-max-items="8"
            data-ngf-item-fields='[{"key":"image","label":"Photo","type":"image"},{"key":"name","label":"Service Name","type":"text"},{"key":"desc","label":"Description","type":"textarea"}]'
          />
        </div>
      </section>

      {/* About Our Work */}
      <section id="about" className="px-4 py-20 sm:px-6" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center">
            <span className="gold-chip">Our Work</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--text)] sm:text-4xl">About What We Do</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--muted)' }}>
              Every job is done by hand, start to finish. No shortcuts, no rushing — just clean, professional installs that hold up long-term. Here is a closer look at each service we offer.
            </p>
          </div>

          {/* Service detail cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* Automobile Tint */}
            <div className="panel-gold flex flex-col gap-4 p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>01</span>
                <h3 className="text-base font-semibold text-[var(--text)]">Automobile Window Tint</h3>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--line)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                We use professional-grade film cut precisely to each vehicle — sedans, trucks, SUVs, and everything in between. Tint keeps your interior cooler, protects against UV fading, and reduces glare without sacrificing visibility. Every install is done bubble-free and clean.
              </p>
            </div>

            {/* Residential & Commercial */}
            <div className="panel-gold flex flex-col gap-4 p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>02</span>
                <h3 className="text-base font-semibold text-[var(--text)]">Residential & Commercial Film</h3>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--line)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Window film for homes, offices, and storefronts that cuts energy costs, adds privacy, and blocks harmful UV rays — without making rooms feel dark. We work with windows of any size and can match the right film to your specific goals, whether that is heat rejection, privacy, or both.
              </p>
            </div>

            {/* Vinyl Wrap */}
            <div className="panel-gold flex flex-col gap-4 p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>03</span>
                <h3 className="text-base font-semibold text-[var(--text)]">Vinyl Wrap</h3>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--line)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Full vehicle wraps, partial color changes, and accent panels — all cut and applied by hand for a seamless, factory-quality finish. Vinyl wrap is one of the best ways to protect your factory paint while completely changing the look of your vehicle. Removable, durable, and done right.
              </p>
            </div>

            {/* Ambient Lighting */}
            <div className="panel-gold flex flex-col gap-4 p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-widest"
                  style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.35)', color: 'var(--gold)' }}>04</span>
                <h3 className="text-base font-semibold text-[var(--text)]">Ambient Lighting</h3>
              </div>
              <div className="h-px w-full" style={{ background: 'var(--line)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Custom LED accent lighting installed cleanly inside your vehicle. We design the layout to suit your interior, run the wiring out of sight, and mount the lights exactly where they should be. No exposed wires, no dangling strips — just a clean, professional finish that transforms your cabin at night.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2
            data-ngf-field="why.title"
            data-ngf-label="Section Title"
            data-ngf-type="text"
            data-ngf-section="Why Choose Us"
            className="text-center text-3xl font-bold text-[var(--text)] sm:text-4xl"
          >
            {whyTitle}
          </h2>
          <div
            data-ngf-group="why.items"
            data-ngf-item-label="Reason"
            data-ngf-min-items="1"
            data-ngf-max-items="6"
            data-ngf-item-fields='[{"key":"heading","label":"Heading","type":"text"},{"key":"body","label":"Body","type":"textarea"}]'
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {reasons.map((r, i) => (
              <div key={i} className="panel flex flex-col gap-3 p-6">
                <div className="h-0.5 w-8 rounded-full" style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light))' }} />
                <h3
                  data-ngf-field={`why.items.${i}.heading`}
                  data-ngf-label="Heading"
                  data-ngf-type="text"
                  data-ngf-section="Why Choose Us"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  {r.heading ?? ''}
                </h3>
                <p
                  data-ngf-field={`why.items.${i}.body`}
                  data-ngf-label="Body"
                  data-ngf-type="textarea"
                  data-ngf-section="Why Choose Us"
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {r.body ?? ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="cta" className="px-4 py-24 text-center sm:px-6" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-xl">
          <h2
            data-ngf-field="cta.title"
            data-ngf-label="Headline"
            data-ngf-type="text"
            data-ngf-section="Call to Action"
            className="text-3xl font-bold text-[var(--text)] sm:text-4xl"
          >
            {ctaTitle}
          </h2>
          <p
            data-ngf-field="cta.description"
            data-ngf-label="Description"
            data-ngf-type="textarea"
            data-ngf-section="Call to Action"
            className="mx-auto mt-4 max-w-md text-base"
            style={{ color: 'var(--muted)' }}
          >
            {ctaDescription}
          </p>
          <Link href="/quote" className="btn-gold mt-8 inline-flex">
            <span
              data-ngf-field="cta.button"
              data-ngf-label="Button Text"
              data-ngf-type="text"
              data-ngf-section="Call to Action"
            >
              {ctaButton}
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-10 pt-8 text-center sm:px-6" style={{ borderTop: '1px solid var(--line)' }}>
        <p
          data-ngf-field="brand.businessName"
          data-ngf-label="Business Name"
          data-ngf-type="text"
          data-ngf-section="Brand"
          className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--text)]"
        >
          {businessName}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
          <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-[var(--gold)] transition-colors">
            <span data-ngf-field="brand.phone" data-ngf-label="Phone" data-ngf-type="text" data-ngf-section="Brand">{phone}</span>
          </a>
          <span aria-hidden="true">·</span>
          <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] transition-colors">
            @<span data-ngf-field="brand.instagram" data-ngf-label="Instagram Handle" data-ngf-type="text" data-ngf-section="Brand">{instagram}</span>
          </a>
        </div>
        <p
          data-ngf-field="footer.copyright"
          data-ngf-label="Copyright"
          data-ngf-type="text"
          data-ngf-section="Footer"
          className="mt-4 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          {copyright}
        </p>
      </footer>

    </div>
  )
}
