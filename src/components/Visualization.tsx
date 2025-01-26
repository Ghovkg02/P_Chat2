import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { EnvironmentalData } from '../types';

interface VisualizationProps {
  data?: EnvironmentalData;
}

function TerrainMesh({ elevation = 0 }) {
  return (
    <mesh position={[0, elevation / 2, 0]}>
      <boxGeometry args={[10, elevation || 0.1, 10]} />
      <meshStandardMaterial
        color="#4a90e2"
        metalness={0.8}
        roughness={0.2}
        emissive="#0f172a"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function WindIndicator({ direction = 0, speed = 0 }) {
  return (
    <group position={[0, 5, 0]} rotation={[0, direction * Math.PI / 180, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, speed]} />
        <meshStandardMaterial
          color="#60a5fa"
          metalness={0.9}
          roughness={0.1}
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, speed / 2, 0]}>
        <coneGeometry args={[0.3, 1, 32]} />
        <meshStandardMaterial
          color="#60a5fa"
          metalness={0.9}
          roughness={0.1}
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function SunPath({ azimuth = 0, elevation = 45 }) {
  return (
    <group
      position={[0, 10, 0]}
      rotation={[
        (90 - elevation) * Math.PI / 180,
        azimuth * Math.PI / 180,
        0
      ]}
    >
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight color="#f59e0b" intensity={2} distance={20} />
    </group>
  );
}

export function Visualization({ data }: VisualizationProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <TerrainMesh elevation={data?.elevation?.height || 0} />
        
        {data?.wind && (
          <WindIndicator
            direction={parseFloat(data.wind.direction) || 0}
            speed={data.wind.speed || 0}
          />
        )}
        
        {data?.sunPath && (
          <SunPath
            azimuth={data.sunPath.azimuth || 0}
            elevation={data.sunPath.elevation || 45}
          />
        )}

        <Text
          position={[0, 6, 0]}
          color="white"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000"
        >
          {`Elevation: ${data?.elevation?.height || 0}m`}
        </Text>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={30}
        />
        <gridHelper args={[20, 20]} />
      </Canvas>
    </div>
  );
}