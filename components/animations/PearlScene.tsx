'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useMotionValue, useSpring } from 'framer-motion';

interface PearlProps {
  position: [number, number, number];
  scale: number;
  color: string;
  index: number;
}

function Pearl({ position, scale, color, index }: PearlProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Floating motion
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + index * 0.5) * 0.1;

    // Subtle rotation
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    // Parallax effect with mouse
    const mouse = state.mouse;
    meshRef.current.position.x = position[0] + mouse.x * viewport.width * 0.02;
    meshRef.current.position.z = position[2] + mouse.y * viewport.height * 0.01;
  });

  return (
    <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.1}
        transmission={0.9}
        thickness={1}
        clearcoat={1}
        clearcoatRoughness={0}
        ior={1.5}
      />
    </Sphere>
  );
}

function PearlField() {
  const pearls: Array<{ position: [number, number, number]; scale: number; color: string }> = [
    { position: [-2, 0, 0], scale: 0.3, color: '#A78BFA' },
    { position: [1.5, 0.5, -1], scale: 0.25, color: '#8B5E3C' },
    { position: [0, -0.5, 0.5], scale: 0.35, color: '#84CC16' },
    { position: [-0.5, 1, -0.5], scale: 0.2, color: '#F5E9DA' },
    { position: [2, -0.3, 0.8], scale: 0.28, color: '#A78BFA' },
    { position: [-1.5, -0.8, 0.3], scale: 0.22, color: '#8B5E3C' },
    { position: [0.8, 0.8, -0.8], scale: 0.32, color: '#84CC16' },
    { position: [-0.2, -0.2, 1.2], scale: 0.18, color: '#F5E9DA' },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Environment preset="studio" />

      {pearls.map((pearl, index) => (
        <Pearl
          key={index}
          position={pearl.position}
          scale={pearl.scale}
          color={pearl.color}
          index={index}
        />
      ))}
    </>
  );
}

interface PearlSceneProps {
  className?: string;
}

export default function PearlScene({ className }: PearlSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <PearlField />
      </Canvas>
    </div>
  );
}
