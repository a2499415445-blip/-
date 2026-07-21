import { useEffect, useMemo, useRef } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const parseVariationSettings = (settings) => Object.fromEntries(
  settings.split(',').map((setting) => {
    const [axis, value] = setting.trim().split(/\s+/)
    return [axis.replace(/["']/g, ''), Number.parseFloat(value)]
  }),
)

export default function VariableProximity({
  label,
  containerRef,
  radius = 120,
  fromFontVariationSettings = "'wght' 450, 'opsz' 14",
  toFontVariationSettings = "'wght' 900, 'opsz' 56",
  falloff = 'gaussian',
  className = ''
}) {
  const characterRefs = useRef([])
  const pointerRef = useRef({ x: -9999, y: -9999 })
  const variations = useMemo(() => ({
    from: parseVariationSettings(fromFontVariationSettings),
    to: parseVariationSettings(toFontVariationSettings),
  }), [fromFontVariationSettings, toFontVariationSettings])

  const getInfluence = useMemo(() => (distance) => {
    const normalized = clamp(1 - distance / radius, 0, 1)
    if (falloff === 'exponential') return normalized ** 2
    if (falloff === 'gaussian') return Math.exp(-((distance / (radius * .48)) ** 2) / 2)
    return normalized
  }, [falloff, radius])

  useEffect(() => {
    let animationFrame
    const updateCharacters = () => {
      const container = containerRef?.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()

      characterRefs.current.forEach((character) => {
        if (!character) return
        const rect = character.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2 - containerRect.left
        const centerY = rect.top + rect.height / 2 - containerRect.top
        const distance = Math.hypot(pointerRef.current.x - centerX, pointerRef.current.y - centerY)
        const influence = getInfluence(distance)
        const weight = variations.from.wght + ((variations.to.wght ?? variations.from.wght) - variations.from.wght) * influence
        const opticalSize = variations.from.opsz + ((variations.to.opsz ?? variations.from.opsz) - variations.from.opsz) * influence
        character.style.fontVariationSettings = influence > .01 ? `'wght' ${weight}, 'opsz' ${opticalSize}` : fromFontVariationSettings
        character.style.transform = `translateY(${-influence * 2.6}px) scale(${1 + influence * .048})`
        character.style.letterSpacing = `${influence * .014}em`
      })
    }
    const onPointerMove = (event) => {
      const container = containerRef?.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(updateCharacters)
    }
    const reset = () => {
      pointerRef.current = { x: -9999, y: -9999 }
      updateCharacters()
    }
    const container = containerRef?.current
    container?.addEventListener('pointermove', onPointerMove)
    container?.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(animationFrame)
      container?.removeEventListener('pointermove', onPointerMove)
      container?.removeEventListener('pointerleave', reset)
    }
  }, [containerRef, fromFontVariationSettings, getInfluence, variations])

  return <span className={`variable-proximity ${className}`} aria-label={label}>
    {Array.from(label).map((character, index) => <span className="variable-proximity-character" aria-hidden="true" key={`${character}-${index}`} ref={(element) => { characterRefs.current[index] = element }}>{character === ' ' ? '\u00a0' : character}</span>)}
  </span>
}
