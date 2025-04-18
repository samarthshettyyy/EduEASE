// components/SimpleModelViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface SimpleModelViewerProps {
  modelPath: string;
  width?: string;
  height?: string;
}

const SimpleModelViewer: React.FC<SimpleModelViewerProps> = ({ 
  modelPath, 
  width = '100%', 
  height = '300px' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("Model viewer initializing with path:", modelPath);
    setIsLoading(true);
    setHasError(false);

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;

    // Setup renderer with alpha for transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0xf0f0f0, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a backup cube in case model loading fails
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x3584e4 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    // Only try to load the model if we have a valid path
    if (!modelPath) {
      console.log("No model path provided, showing placeholder cube");
      scene.add(cube);
      setIsLoading(false);
    } else {
      // Normalize the model path to ensure it starts with a slash
      // This is crucial for proper URL resolution
      let modelUrl = modelPath;
      if (!modelPath.startsWith('/') && !modelPath.startsWith('http')) {
        modelUrl = `/${modelPath}`;
      }
      
      console.log("Attempting to load model from:", modelUrl);
      
      // Create a loading manager to track progress
      const loadingManager = new THREE.LoadingManager();
      loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading model: ${Math.round((itemsLoaded / itemsTotal) * 100)}% loaded`);
      };
      
      loadingManager.onError = (url) => {
        console.error('Error loading model from', url);
        setHasError(true);
        setIsLoading(false);
        scene.add(cube); // Add fallback cube
      };
      
      const loader = new GLTFLoader(loadingManager);
      
      loader.load(
        modelUrl,
        (gltf) => {
          console.log("Model loaded successfully!");
          
          // Clear any previous models
          while(scene.children.length > 0) { 
            const obj = scene.children[0];
            scene.remove(obj);
          }
          
          // Re-add lights
          scene.add(ambientLight);
          scene.add(directionalLight);
          
          const model = gltf.scene;
          
          // Center model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Scale model to fit view
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 3 / maxDim;
            model.scale.multiplyScalar(scale);
          }
          
          scene.add(model);
          setIsLoading(false);
          console.log("Model added to scene successfully");
        },
        (progress) => {
          const progressPercent = (progress.loaded / (progress.total || 1)) * 100;
          console.log("Loading progress:", progressPercent.toFixed(2), "%");
        },
        (error) => {
          console.error("Error loading model:", error);
          setHasError(true);
          setIsLoading(false);
          // Add the cube as a fallback
          scene.add(cube);
        }
      );
    }

    // Animation loop with rotation
    let rotationSpeed = 0.01;
    
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Rotate all objects in the scene except lights
      scene.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.rotation.y += rotationSpeed;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of resources
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [modelPath]); // Re-run effect when modelPath changes

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        position: 'relative',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.7)',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #3584e4',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '10px'
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
            <div>Loading 3D model...</div>
          </div>
        </div>
      )}
      
      {hasError && !isLoading && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10
        }}>
          Error loading model. Displaying placeholder.
        </div>
      )}
    </div>
  );
};

export default SimpleModelViewer;