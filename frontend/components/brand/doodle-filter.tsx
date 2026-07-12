export function DoodleFilter() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <filter id="doodle-rough-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.015" numOctaves="3" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
