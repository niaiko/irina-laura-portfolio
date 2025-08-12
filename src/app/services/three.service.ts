import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;

  constructor() { }

  // Initialiser une scène Three.js
  initScene(container: HTMLElement, options: {
    enableOrbitControls?: boolean,
    backgroundAlpha?: number,
    cameraPosition?: { x: number, y: number, z: number }
  } = {}): {
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  } {
    // Créer la scène
    this.scene = new THREE.Scene();

    // Créer la caméra
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    
    // Position de la caméra
    const camPos = options.cameraPosition || { x: 0, y: 0, z: 5 };
    this.camera.position.set(camPos.x, camPos.y, camPos.z);

    // Créer le renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, options.backgroundAlpha || 0);
    
    // Ajouter au container
    container.appendChild(this.renderer.domElement);

    // Gérer le redimensionnement
    this.handleResize(container);

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  // Créer des particules flottantes
  createFloatingParticles(scene: THREE.Scene, count: number = 100): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color(0x0ea5e9), // Primary blue
      new THREE.Color(0x3b82f6), // Blue
      new THREE.Color(0x8b5cf6), // Purple
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0x10b981), // Green
    ];

    for (let i = 0; i < count; i++) {
      // Positions aléatoires dans un cube
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Couleurs aléatoires
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Tailles aléatoires
      sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material pour des particules brillantes
    const material = new THREE.ShaderMaterial({
      transparent: true,
      vertexColors: true,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - (dist * 2.0);
          alpha = pow(alpha, 2.0);
          
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return particles;
  }

  // Créer un système de cristaux volants avec orbes énergétiques
  createFloatingCrystals(scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group();
    
    const crystalCount = 15;
    const orbCount = 25;

    // Créer les cristaux
    for (let i = 0; i < crystalCount; i++) {
      // Géométrie de cristal (octaèdre allongé)
      const geometry = new THREE.OctahedronGeometry(0.5, 1);
      
      // Matériau cristallin avec effets de réfraction
      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          opacity: { value: 0.7 },
          color1: { value: new THREE.Color(0x0ea5e9) },
          color2: { value: new THREE.Color(0x8b5cf6) },
          color3: { value: new THREE.Color(0x06b6d4) }
        },
        vertexShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            vec3 pos = position;
            
            // Déformation cristalline
            float wave1 = sin(pos.y * 3.0 + time * 2.0) * 0.1;
            float wave2 = sin(pos.x * 2.0 + time * 1.5) * 0.05;
            pos += normal * (wave1 + wave2);
            
            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float opacity;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          
          void main() {
            // Effet de réfraction basé sur l'angle de vue
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            float fresnel = 1.0 - abs(dot(viewDir, vNormal));
            fresnel = pow(fresnel, 2.0);
            
            // Gradient de couleur basé sur la position
            float colorMix1 = sin(vPosition.y * 2.0 + time) * 0.5 + 0.5;
            float colorMix2 = sin(vPosition.x * 1.5 + time * 0.8) * 0.5 + 0.5;
            
            vec3 color = mix(color1, color2, colorMix1);
            color = mix(color, color3, colorMix2 * fresnel);
            
            // Effet de brillance interne
            float glow = sin(time * 3.0 + vPosition.y * 5.0) * 0.3 + 0.7;
            color *= glow;
            
            // Effet de bord lumineux
            float edgeGlow = pow(fresnel, 0.5) * 2.0;
            color += vec3(edgeGlow * 0.3);
            
            gl_FragColor = vec4(color, opacity * (fresnel * 0.8 + 0.2));
          }
        `
      });

      const crystal = new THREE.Mesh(geometry, material);
      
      // Position aléatoire dans un espace 3D
      crystal.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      );
      
      // Rotation aléatoire initiale
      crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Échelle aléatoire
      const scale = 0.5 + Math.random() * 1.5;
      crystal.scale.set(scale, scale * 1.5, scale);
      
      crystal.userData = {
        originalPosition: crystal.position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01
        },
        floatOffset: Math.random() * Math.PI * 2,
        type: 'crystal'
      };
      
      group.add(crystal);
    }

    // Créer les orbes énergétiques
    for (let i = 0; i < orbCount; i++) {
      const geometry = new THREE.SphereGeometry(0.15, 16, 16);
      
      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color().setHSL(Math.random(), 0.8, 0.6) }
        },
        vertexShader: `
          uniform float time;
          varying vec3 vPosition;
          
          void main() {
            vPosition = position;
            
            vec3 pos = position;
            
            // Pulsation
            float pulse = sin(time * 4.0 + length(position) * 10.0) * 0.1 + 1.0;
            pos *= pulse;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec3 vPosition;
          
          void main() {
            float dist = length(vPosition);
            float alpha = 1.0 - smoothstep(0.0, 1.0, dist);
            
            // Effet de pulsation lumineux
            float pulse = sin(time * 6.0) * 0.3 + 0.7;
            alpha *= pulse;
            
            // Centre plus lumineux
            float center = 1.0 - dist * 2.0;
            center = max(0.0, center);
            
            vec3 finalColor = color + vec3(center * 0.5);
            
            gl_FragColor = vec4(finalColor, alpha * 0.8);
          }
        `
      });

      const orb = new THREE.Mesh(geometry, material);
      
      // Position aléatoire
      orb.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 25
      );
      
      orb.userData = {
        originalPosition: orb.position.clone(),
        orbitRadius: 2 + Math.random() * 5,
        orbitSpeed: 0.5 + Math.random() * 1.5,
        floatOffset: Math.random() * Math.PI * 2,
        type: 'orb'
      };
      
      group.add(orb);
    }

    scene.add(group);
    return group;
  }

  // Créer une grille 3D interactive
  createInteractiveGrid(scene: THREE.Scene, size: number = 20): THREE.Group {
    const group = new THREE.Group();
    
    // Matériau lumineux
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        varying vec3 vPosition;
        varying float vDistance;
        
        void main() {
          vPosition = position;
          
          vec3 pos = position;
          float dist = distance(pos.xy, mouse * 10.0);
          vDistance = dist;
          
          // Ondulation basée sur la distance à la souris
          pos.z += sin(dist * 0.3 - time * 2.0) * 0.5;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying float vDistance;
        
        void main() {
          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          float intensity = 1.0 / (vDistance * 0.1 + 1.0);
          
          vec3 color = mix(
            vec3(0.05, 0.65, 0.91), // Primary blue
            vec3(0.54, 0.36, 0.97), // Purple
            pulse
          );
          
          float alpha = intensity * 0.6;
          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    // Créer la grille
    for (let i = -size/2; i <= size/2; i += 2) {
      for (let j = -size/2; j <= size/2; j += 2) {
        const geometry = new THREE.PlaneGeometry(0.1, 0.1);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(i, j, 0);
        group.add(plane);
      }
    }

    scene.add(group);
    return group;
  }

  // Animer les particules
  animateParticles(particles: THREE.Points, time: number): void {
    const positions = particles.geometry.attributes['position'];
    const positionArray = positions.array as Float32Array;

    for (let i = 0; i < positionArray.length; i += 3) {
      // Mouvement flottant
      positionArray[i + 1] += Math.sin(time * 0.001 + i) * 0.01;
      positionArray[i] += Math.cos(time * 0.001 + i) * 0.005;
    }

    positions.needsUpdate = true;
    particles.rotation.y = time * 0.0002;
  }

  // Animer les cristaux volants et orbes énergétiques
  animateFloatingCrystals(crystalGroup: THREE.Group, time: number, mousePos: { x: number, y: number }): void {
    crystalGroup.children.forEach((child, index) => {
      const userData = child.userData;
      
      if (userData['type'] === 'crystal') {
        const crystal = child as THREE.Mesh;
        
        // Rotation continue
        crystal.rotation.x += userData['rotationSpeed'].x;
        crystal.rotation.y += userData['rotationSpeed'].y;
        crystal.rotation.z += userData['rotationSpeed'].z;
        
        // Mouvement flottant
        const floatY = Math.sin(time * 0.001 + userData['floatOffset']) * 2;
        const floatX = Math.cos(time * 0.0008 + userData['floatOffset']) * 1;
        
        crystal.position.x = userData['originalPosition'].x + floatX;
        crystal.position.y = userData['originalPosition'].y + floatY;
        
        // Réaction à la souris
        const mouseInfluence = new THREE.Vector3(mousePos.x * 5, mousePos.y * 3, 0);
        crystal.position.add(mouseInfluence.multiplyScalar(0.1));
        
        // Mise à jour du shader
        const material = crystal.material as THREE.ShaderMaterial;
        material.uniforms['time'].value = time * 0.001;
        
        // Effet de brillance qui pulse
        const brightness = 0.5 + Math.sin(time * 0.002 + index) * 0.3;
        material.uniforms['opacity'].value = brightness;
        
      } else if (userData['type'] === 'orb') {
        const orb = child as THREE.Mesh;
        
        // Mouvement orbital autour de la position originale
        const angle = time * 0.001 * userData['orbitSpeed'] + userData['floatOffset'];
        const radius = userData['orbitRadius'];
        
        orb.position.x = userData['originalPosition'].x + Math.cos(angle) * radius;
        orb.position.y = userData['originalPosition'].y + Math.sin(angle * 0.7) * radius * 0.5;
        orb.position.z = userData['originalPosition'].z + Math.sin(angle * 1.3) * radius * 0.3;
        
        // Attraction vers la souris
        const mouseTarget = new THREE.Vector3(mousePos.x * 10, mousePos.y * 6, 0);
        const direction = mouseTarget.clone().sub(orb.position);
        direction.multiplyScalar(0.005);
        orb.position.add(direction);
        
        // Mise à jour du shader
        const material = orb.material as THREE.ShaderMaterial;
        material.uniforms['time'].value = time * 0.001;
        
        // Changement de couleur dynamique
        const hue = (time * 0.0005 + index * 0.1) % 1;
        material.uniforms['color'].value.setHSL(hue, 0.8, 0.6);
      }
    });

    // Rotation globale du groupe
    crystalGroup.rotation.y = Math.sin(time * 0.0003) * 0.1;
    crystalGroup.rotation.x = Math.cos(time * 0.0004) * 0.05;
  }

  // Animer la grille interactive
  animateGrid(grid: THREE.Group, time: number, mousePos: { x: number, y: number }): void {
    grid.children.forEach((plane) => {
      const material = (plane as THREE.Mesh).material as THREE.ShaderMaterial;
      material.uniforms['time'].value = time * 0.001;
      material.uniforms['mouse'].value.set(mousePos.x, mousePos.y);
    });
  }

  // Nettoyer les ressources
  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
    
    if (this.scene) {
      this.scene.clear();
    }
  }

  // Gérer le redimensionnement
  private handleResize(container: HTMLElement): void {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        if (this.camera && this.renderer) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(container);
  }

  // Créer une animation de morphing de géométrie
  createMorphingGeometry(scene: THREE.Scene): THREE.Mesh {
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0ea5e9) },
        color2: { value: new THREE.Color(0x8b5cf6) }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          
          // Déformation basée sur les normales
          float displacement = sin(pos.x * 2.0 + time) * 
                              sin(pos.y * 2.0 + time) * 
                              sin(pos.z * 2.0 + time) * 0.3;
          
          pos += normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
          fresnel = pow(1.0 - fresnel, 2.0);
          
          vec3 color = mix(color1, color2, fresnel);
          color += sin(time + vPosition.x) * 0.1;
          
          gl_FragColor = vec4(color, 0.8);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return mesh;
  }
}
