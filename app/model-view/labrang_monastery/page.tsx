"use client";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  const { scene } = useGLTF("/models\\labrang monastry.glb");
  return <primitive object={scene} scale={8} />;
}

function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#d4af37" />
    </mesh>
  );
}

export default function Viewer() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-8 md:px-16 py-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
           Labrang Monastery
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-2 font-light">
            Eastern Himalayas, Sikkim
          </p>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{
            position: [0, 2, 8],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          {/* Lighting for premium look */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={0.8}
            castShadow
          />
          <directionalLight
            position={[-10, 5, -10]}
            intensity={0.2}
            color="#e6d5b8"
          />

          {/* Environment for subtle reflection */}
          <Environment preset="studio" />

          {/* Model */}
          <Suspense fallback={<ModelFallback />}>
            <Model />
          </Suspense>

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate={true}
            autoRotateSpeed={3}
            minDistance={3}
            maxDistance={20}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Canvas>

        {/* Bottom Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="text-white text-sm md:text-base font-light leading-relaxed">
              Experience the sacred architecture of Labrang Monastery, perched
              amid the misty peaks of Sikkim. Rotate • Zoom • Explore
            </p>
            <div className="flex gap-4 mt-6">
              <div className="text-white/80 text-xs">
                <p className="font-medium text-white mb-1">Built</p>
                <p className="font-light">Traditional Tibetan Architecture</p>
              </div>
              <div className="text-white/80 text-xs">
                <p className="font-medium text-white mb-1">Location</p>
                <p className="font-light">Eastern Himalayas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Hints */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {showContent && (
          <div className="animate-pulse text-center">
            <p className="text-gray-500 text-xs tracking-widest">
              DRAG TO ROTATE
            </p>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute top-8 right-8 w-16 h-16 border border-gray-200 opacity-30"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border border-gray-200 opacity-20"></div>
    </div>
  );
}