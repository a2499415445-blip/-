import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Keep scroll work predictable on pages with many media cards. The site is
// desktop-first, so mobile browser resize noise should not rebuild every trigger.
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

const reveal = (target, trigger, options = {}) => {
  if (!target) return
  gsap.fromTo(target, { autoAlpha: 0, y: options.y ?? 64, scale: options.scale ?? 1 }, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: options.duration ?? 1.25,
    ease: options.ease ?? 'power4.out',
    stagger: options.stagger ?? 0,
    overwrite: 'auto',
    scrollTrigger: { trigger, start: options.start ?? 'top 76%', once: true },
  })
}

export default function usePortfolioMotion(rootRef, activePage) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    document.documentElement.classList.add('motion-ready')

    const context = gsap.context(() => {
      if (activePage === 'aigc') {
        const hero = root.querySelector('.hero')
        const curtain = hero?.querySelector('.hero-opening-curtain')
        const titleWords = hero?.querySelector('.hero h1')

        // Keep the first screen readable even when a browser throttles animation timers.
        // The decorative opening layer is retained in CSS, but never gates the page content.
        if (curtain) gsap.set(curtain, { display: 'none' })
        if (hero) {
          gsap.fromTo(titleWords, { yPercent: 18, scaleY: .92 }, { yPercent: 0, scaleY: 1, duration: 1.12, ease: 'power4.out', overwrite: 'auto' })
          gsap.fromTo(hero.querySelector('.hero-video'), { y: 28, scale: .97 }, { y: 0, scale: 1, duration: 1.18, ease: 'expo.out', overwrite: 'auto' })
          gsap.fromTo(hero.querySelector('.hero-view-count'), { x: 18, y: 12 }, { x: 0, y: 0, duration: .9, ease: 'power3.out', overwrite: 'auto' })
        }

        const sections = [
          { element: root.querySelector('.intro'), heading: '.intro-grid h2', cards: '.stats > div', detail: '.intro-focus' },
          { element: root.querySelector('.work'), heading: '.work-head h2', cards: '.project-list > .project', detail: '.work-head > p' },
          { element: root.querySelector('.skills'), heading: '.skills > h2', cards: '.skill-grid > article' },
          { element: root.querySelector('.contact'), heading: '.contact h2', cards: '.mail, .footer-line', detail: '.contact .overline' },
        ]

        sections.forEach(({ element, heading, cards, detail }) => {
          if (!element) return
          const title = element.querySelector(heading)
          reveal(title, element, { y: 118, scale: .91, duration: 1.46, start: 'top 73%' })
          const accent = title?.querySelector('em')
          if (accent) reveal(accent, element, { y: 42, duration: 1.08, start: 'top 65%' })
          reveal(detail ? element.querySelector(detail) : null, element, { y: 44, duration: .92, start: 'top 67%' })
          reveal(element.querySelectorAll(cards), element, { y: 72, duration: 1.08, stagger: .16, start: 'top 63%' })
        })

        root.querySelectorAll('.project').forEach((project) => {
          const cover = project.querySelector('.project-cover')
          if (!cover) return
          gsap.fromTo(cover, { scale: 1.15, clipPath: 'inset(0 0 13% 0)' }, {
            scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.55, ease: 'power3.out', overwrite: 'auto',
            scrollTrigger: { trigger: project, start: 'top 78%', once: true },
          })
          gsap.to(cover, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: .75 } })
        })
      } else {
        root.querySelectorAll('.model-page').forEach((page) => {
          const heading = page.querySelector('.model-page-head h3, .model-landing-copy h2')
          const art = page.querySelector('.model-hero-art')
          const cards = page.querySelectorAll('.model-view-comparison figure, .model-tech-grid figure')
          reveal(heading, page, { y: 110, scale: .92, duration: 1.44, start: 'top 74%' })
          const accent = heading?.querySelector('em, span')
          if (accent) reveal(accent, page, { y: 42, duration: 1.04, start: 'top 66%' })
          reveal(page.querySelector('.model-summary, .model-page-head > p'), page, { y: 46, duration: .95, start: 'top 68%' })
          reveal(art, page, { y: 86, scale: .94, duration: 1.45, start: 'top 76%' })
          reveal(cards, page, { y: 70, duration: 1.06, stagger: .1, start: 'top 68%' })
          // Cards above already stagger into view. Avoid another ScrollTrigger for
          // every technical image: some model pages contain many high-resolution maps.
        })
      }
    }, root)

    return () => {
      context.revert()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [rootRef, activePage])
}
