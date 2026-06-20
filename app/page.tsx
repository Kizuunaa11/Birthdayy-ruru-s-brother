"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { Howl } from 'howler';
import type { Group, Mesh } from 'three';

const baseSound = new Howl({
  src: ['https://assets.codepen.io/9545/piano-chime.mp3'],
  volume: 0.35,
  loop: false
});

const candleSound = new Howl({
  src: ['https://assets.codepen.io/9545/light-switch.mp3'],
  volume: 0.5
});

function GiftBox({ isOpened }: { isOpened: boolean }) {
  const lidRef = useRef<Mesh | null>(null);
  const boxRef = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += delta * 0.22;
    }
  });

  useEffect(() => {
    if (!isOpened || !lidRef.current || !boxRef.current) return;

    gsap.to(lidRef.current.rotation, {
      x: -Math.PI * 0.65,
      duration: 1.5,
      ease: 'power3.out'
    });

    gsap.to(boxRef.current.position, {
      y: 0.08,
      duration: 0.8,
      yoyo: true,
      repeat: 3,
      ease: 'power2.inOut'
    });
  }, [isOpened]);

  return (
    <group ref={boxRef}>
      <mesh position={[0, -0.72, 0]} receiveShadow>
        <boxGeometry args={[2.6, 1.8, 2.6]} />
        <meshStandardMaterial color="#17224c" metalness={0.7} roughness={0.24} />
      </mesh>

      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.32, 2.7]} />
        <meshStandardMaterial color="#f8c65d" metalness={0.94} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.18, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.18, 0.18, 2.24]} />
        <meshStandardMaterial color="#f27f5f" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[-1.02, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.18, 0.18, 2.24]} />
        <meshStandardMaterial color="#f27f5f" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.38, 0]} scale={[0.16, 1.1, 1.1]}>
        <cylinderGeometry args={[0.12, 0.12, 2.8, 24]} />
        <meshStandardMaterial color="#fff1b7" metalness={0.78} roughness={0.14} />
      </mesh>
      <mesh position={[0, -0.38, 0]} rotation={[0, 0, 0.78]} scale={[0.16, 1.1, 1.1]}>
        <cylinderGeometry args={[0.12, 0.12, 2.8, 24]} />
        <meshStandardMaterial color="#fff1b7" metalness={0.78} roughness={0.14} />
      </mesh>
    </group>
  );
}

const particleIds = Array.from({ length: 30 }, (_, index) => index);

export default function HomePage() {
  const [scene, setScene] = useState<'intro' | 'gift'>('intro');
  const [boxOpened, setBoxOpened] = useState(false);
  const [cakeRevealed, setCakeRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    baseSound.play();
  }, []);

  const handleTransition = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScene('gift');
  };

  const handleOpenBox = () => {
    if (boxOpened) return;
    setBoxOpened(true);
    candleSound.play();
    setTimeout(() => {
      setCakeRevealed(true);
      setShowConfetti(true);
    }, 1200);
  };

  const glow = useMemo(
    () => [
      { x: '12%', y: '18%', size: 110, opacity: 0.24, color: '#ffdc9e' },
      { x: '70%', y: '24%', size: 140, opacity: 0.18, color: '#80c6ff' },
      { x: '50%', y: '72%', size: 180, opacity: 0.14, color: '#ff89c8' }
    ],
    []
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-white">
      <div className="pointer-events-none absolute inset-0 bg-radialGlow opacity-80" />
      {glow.map((spot, index) => (
        <div
          key={index}
          className="pointer-events-none absolute rounded-full blur-3xl"
          style={{
            width: spot.size,
            height: spot.size,
            left: spot.x,
            top: spot.y,
            background: spot.color,
            opacity: spot.opacity
          }}
        />
      ))}

      <div className="absolute inset-0">
        {particleIds.map((particle) => (
          <motion.div
            key={particle}
            className="particle"
            initial={{ opacity: 0, scale: 0.35, x: '50vw', y: '88vh' }}
            animate={{ opacity: [0, 0.7, 0], x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`], y: [`${Math.random() * 110}%`, '-14%'] }}
            transition={{ duration: 7 + Math.random() * 3, repeat: Infinity, ease: 'easeOut', delay: Math.random() * 1.8 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {scene === 'intro' && (
          <motion.section
            className="relative flex h-screen w-full flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0, scale: 1.06, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -42, filter: 'blur(26px)' }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-5xl font-semibold uppercase tracking-[0.24em] text-white sm:text-6xl md:text-7xl">
                Barakallah Fii Umrik
              </h1>
            </div>

            <button
              onClick={handleTransition}
              className="mt-16 inline-flex rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-medium uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/15"
            >
              Begin the celebration
            </button>
          </motion.section>
        )}

        {scene === 'gift' && (
          <motion.section
            className="relative flex min-h-screen flex-col items-center justify-center px-6 py-14 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="relative z-10 mb-10 max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
              <h2 className="text-4xl font-semibold text-white sm:text-5xl">Click gift box!</h2>
            </div>
            <div className="relative flex w-full max-w-3xl flex-col items-center justify-center">
              <div className="absolute inset-x-0 top-16 h-32 bg-gradient-to-b from-white/20 to-transparent blur-3xl" />
              <div className="absolute inset-x-0 bottom-24 h-40 bg-gradient-to-t from-[#ffd9a8]/30 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32">
                <div className="mx-auto h-24 w-64 rounded-full bg-gradient-to-r from-[#ffd9a8]/35 via-[#ffb4c6]/10 to-[#8bd0ff]/25" />
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {!cakeRevealed ? (
                    <motion.button
                      key="box"
                      onClick={handleOpenBox}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="group relative flex h-[420px] w-[420px] items-center justify-center rounded-[40px] border border-white/10 bg-slate-950/30 shadow-glow transition-transform duration-500 hover:-translate-y-2 hover:scale-105 focus:outline-none"
                    >
                      <Canvas camera={{ position: [0, 1.8, 5], fov: 32 }} className="h-full w-full rounded-[40px]">
                        <ambientLight intensity={0.55} />
                        <directionalLight position={[2, 6, 4]} intensity={1.05} color="#ffe7c5" />
                        <spotLight position={[-4, 6, 5]} angle={0.35} intensity={0.45} penumbra={1} />
                        <Float floatIntensity={1.1} rotationIntensity={0.35} floatRange={[0.18, 0.5]}>
                          <GiftBox isOpened={boxOpened} />
                        </Float>
                        <ContactShadows position={[0, -1, 0]} opacity={0.75} scale={10} blur={3} far={1.5} />
                        <Sparkles size={3} scale={1.8} noise={1.4} speed={0.35} count={28} color="#ffe59c" />
                        <Environment preset="sunset" />
                      </Canvas>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="message"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="relative flex h-[420px] w-[420px] flex-col items-center justify-center rounded-[40px] border border-white/10 bg-black/30 shadow-soft backdrop-blur-xl p-10"
                    >
                      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_center,_rgba(255,194,117,0.18),_transparent_55%)]" />
                      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                        <p className="text-3xl font-semibold uppercase tracking-[0.18em] text-amber-100">doa for u</p>
                        <div className="space-y-3 text-base leading-7 text-white/85 sm:text-lg">
                          <p>HBD KAKAKK!!! Panjang umurr dan sehatt selaluuu di lancarkan rezekinya dan di permudah segalanyaa. am sorry btw nda bisa kasih apa2 + situ juga jauh banget.</p>
                        </div>
                        <div className="mt-4 rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-2 text-sm text-amber-100/90 backdrop-blur-lg">
                          Semoga doa ini selalu menyertai langkahmu.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
        )}

      </AnimatePresence>

      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute h-3 w-3 rounded-full"
              initial={{ y: -40, opacity: 0, x: '50%' }}
              animate={{ y: '110vh', opacity: [1, 1, 0], x: [`${Math.random() * 90}%`, `${Math.random() * 110}%`] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 1.2, ease: 'easeIn' }}
              style={{ left: `${Math.random() * 100}%`, backgroundColor: `hsl(${Math.random() * 50 + 30}, 90%, 70%)` }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
