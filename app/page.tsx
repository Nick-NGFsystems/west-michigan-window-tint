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

      {/* Reviews */}
      <section id="about" className="px-4 py-20 sm:px-6" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="gold-chip">Reviews</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--text)] sm:text-4xl">What Customers Are Saying</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--muted)' }}>
              Real reviews from real customers on Facebook.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Review 1 — Ethan S. */}
            <div className="panel-gold flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="var(--gold)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                &ldquo;Zach got me with 25% on the windshield and 5% all the way around. Looks great on my truck and gives me the privacy I&apos;ve been looking for! I would definitely recommend Zach to others looking for a tint.&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">Ethan S.</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,168,75,0.6)' }}>Facebook</span>
              </div>
            </div>

            {/* Review 2 — John M. */}
            <div className="panel-gold flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="var(--gold)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                &ldquo;Zach recommended to me by multiple friends, and he did not disappoint. Uses high quality tint, can get ceramic or dyed, and he&apos;s fairly priced.&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">John M.</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,168,75,0.6)' }}>Facebook</span>
              </div>
            </div>

            {/* Review 3 — Michael V. */}
            <div className="panel-gold flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="var(--gold)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                &ldquo;He did a great job on my Model S!&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">Michael V.</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,168,75,0.6)' }}>Facebook</span>
              </div>
            </div>

            {/* Review 4 — Michael N. */}
            <div className="panel-gold flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="var(--gold)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                &ldquo;Zach took great care of my car throughout the whole process, keeping me in the loop with everything. My BMW e39 looks great, and I will be giving him more business.&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">Michael N.</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,168,75,0.6)' }}>Facebook</span>
              </div>
            </div>

            {/* Review 5 — Alex M. */}
            <div className="panel-gold flex flex-col gap-4 p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="var(--gold)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                &ldquo;Worked great with my budget, and was plenty flexible with my schedule. Amazing work! My tint is great! 11/10!&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">Alex M.</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(200,168,75,0.6)' }}>Facebook</span>
              </div>
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
            className="mt-4 text-sm leading-relaxed sm:text-base"
            style={{ color: 'var(--muted)' }}
          >
            {ctaDescription}
          </p>
          <Link href="/quote" className="btn-gold mt-8 inline-block">
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
      <footer className="px-4 py-8 sm:px-6" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p
            data-ngf-field="footer.copyright"
            data-ngf-label="Copyright"
            data-ngf-type="text"
            data-ngf-section="Footer"
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {copyright}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://www.instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:text-[var(--text)]"
              style={{ color: 'var(--muted)' }}
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61586828482179"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:text-[var(--text)]"
              style={{ color: 'var(--muted)' }}
            >
              Facebook
            </a>
          </div>
        </div>
      </footer>

      {/* NGF Systems credit */}
      <div className="py-3 text-center text-[10px]" style={{ color: 'var(--muted)', borderTop: '1px solid var(--line)', opacity: 0.5 }}>
        Website by <a href="https://ngfsystems.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] transition-colors">NGF Systems</a>
      </div>

    </div>
  )
}
