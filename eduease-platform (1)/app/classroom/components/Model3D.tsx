"use client"

import { useGLTF } from "@react-three/drei"

interface ModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  [key: string]: any
}

function Model3D(props: ModelProps) {
  // Use a placeholder or local model path
  const modelPath = "/assets/3d/Hand.glb"
  
  try {
    const { scene } = useGLTF(modelPath)
    return <primitive object={scene} scale={2} {...props} />
  } catch (error) {
    console.error("Error loading 3D model:", error)
    // Return a simple fallback
    return (
      <mesh {...props}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    )
  }
}

export default Model3D