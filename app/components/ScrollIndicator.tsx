'use client'

import { useScroll, useSpring, useTransform } from 'framer-motion'
import { MotionDiv } from '@/components/motion/MotionWrapper'

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll()

  // Create a smoother animation with spring physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Create a dynamic color effect based on scroll position
  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'linear-gradient(90deg, rgb(var(--accent-blue)), rgb(var(--accent-cyan)))',
      'linear-gradient(90deg, rgb(var(--accent-cyan)), rgb(var(--accent-purple)))',
      'linear-gradient(90deg, rgb(var(--accent-purple)), rgb(var(--accent-blue)))'
    ]
  )

  return (
    <>
      {/* Main progress bar */}
      <MotionDiv
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{ scaleX, background }}
      />

      {/* Subtle glow effect */}
      <MotionDiv
        className="fixed top-0 left-0 right-0 h-1 blur-sm opacity-70 z-40 origin-left"
        style={{ scaleX, background }}
      />
    </>
  )
}