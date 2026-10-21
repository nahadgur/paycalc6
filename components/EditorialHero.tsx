import Image from 'next/image'

export default function EditorialHero() {
  return (
    <header className="editorial-hero">
      <div className="editorial-hero-copy">
        <p className="editorial-kicker">Kenya PAYE calculator · 2026</p>
        <h1>Big salary.<br /><span>Real take-home.</span></h1>
        <p className="editorial-deck">Know what lands in your account.</p>
        <a className="editorial-jump" href="#salary-calculator">Work out your pay <span aria-hidden="true">↘</span></a>
      </div>
      <div className="editorial-art">
        <Image src="/brand/paye-nairobi-collage.webp" alt="" width={1024} height={1024} sizes="(max-width: 640px) 100vw, 55vw" priority />
      </div>
    </header>
  )
}
