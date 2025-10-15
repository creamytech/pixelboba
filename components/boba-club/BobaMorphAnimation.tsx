'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function BobaCup() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      {/* Main boba cup shape */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#A78BFA"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.1}
        />
      </Sphere>

      {/* Floating tool icons representation - simplified spheres */}
      <Sphere args={[0.3, 32, 32]} position={[2.5, 1, 0]}>
        <meshStandardMaterial color="#84CC16" emissive="#84CC16" emissiveIntensity={0.2} />
      </Sphere>

      <Sphere args={[0.35, 32, 32]} position={[-2.3, 0.5, 0.5]}>
        <meshStandardMaterial color="#8B5E3C" emissive="#8B5E3C" emissiveIntensity={0.2} />
      </Sphere>

      <Sphere args={[0.4, 32, 32]} position={[1.8, -1.5, 1]}>
        <meshStandardMaterial color="#F5E9DA" emissive="#F5E9DA" emissiveIntensity={0.2} />
      </Sphere>

      <Sphere args={[0.25, 32, 32]} position={[-1.5, -2, -0.5]}>
        <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
}

export default function BobaMorphAnimation() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A78BFA" />
        <BobaCup />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
