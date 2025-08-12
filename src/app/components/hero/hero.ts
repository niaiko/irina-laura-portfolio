import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeService } from '../../services/three.service';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroContainer', { static: false }) heroContainer!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement!: ElementRef;
  @ViewChild('subtitleElement', { static: false }) subtitleElement!: ElementRef;
  @ViewChild('buttonsContainer', { static: false }) buttonsContainer!: ElementRef;
  @ViewChild('floatingElements', { static: false }) floatingElements!: ElementRef;
  @ViewChild('floatingImages', { static: false }) floatingImages!: ElementRef;
  @ViewChild('threeContainer', { static: false }) threeContainer!: ElementRef;

  // Three.js objects
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;
  private floatingCrystals: THREE.Group | null = null;
  private morphingGeo: THREE.Mesh | null = null;
  private animationId: number | null = null;
  private mousePos = { x: 0, y: 0 };

  typingText = '';
  private typingTexts = [
    'Spécialiste Midjourney & Leonardo AI',
    'Expert en post-production Photoshop',
    'Créateur de prompts créatifs',
    'Designer d\'univers visuels uniques'
  ];
  private currentTextIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typingSpeed = 100;
  private deletingSpeed = 50;
  private pauseTime = 2000;
  private typingInterval: any;

  // Images flottantes pour les stories/œuvres
  floatingImagesList = [
    {
      src: 'images/choisir-son-hebergement-web-infomaniak.jpg',
      alt: 'Œuvre IA - Hébergement Web',
      position: { top: 15, left: 8 }
    },
    {
      src: 'images/navigateur-vs-moteur.png',
      alt: 'Création IA - Navigateur vs Moteur',
      position: { top: 25, left: 85 }
    },
    {
      src: 'images/app-mobile-prix.png',
      alt: 'Design IA - Application Mobile',
      position: { top: 60, left: 5 }
    },
    {
      src: 'images/jeux-navigateur.png',
      alt: 'Art IA - Jeux Multijoueur',
      position: { top: 70, left: 80 }
    },
    {
      src: 'images/navigateur-mi.png',
      alt: 'Illustration IA - Navigateur Mi',
      position: { top: 35, left: 15 }
    },
    {
      src: 'images/guide-navigateur.png',
      alt: 'Visuel IA - Guide Navigateur',
      position: { top: 45, left: 75 }
    }
  ];

  constructor(private threeService: ThreeService) {}

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngAfterViewInit(): void {
    this.initGSAPAnimations();
    this.initThreeJS();
    this.setupMouseTracking();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    
    // Nettoyer Three.js
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.threeService.dispose();
  }

  private initGSAPAnimations(): void {
    // Animation d'entrée du hero
    const tl = gsap.timeline();
    
    // Animation du titre principal
    tl.fromTo(this.titleElement?.nativeElement, 
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8,
        rotationX: 45
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "power3.out"
      }
    )
    // Animation du sous-titre
    .fromTo(this.subtitleElement?.nativeElement,
      {
        opacity: 0,
        y: 50,
        skewY: 5
      },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8"
    )
    // Animation des boutons
    .fromTo(this.buttonsContainer?.nativeElement.children,
      {
        opacity: 0,
        y: 50,
        scale: 0.5,
        rotation: 15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(2)",
        stagger: 0.2
      }, "-=0.5"
    );

    // Animation des éléments flottants
    this.animateFloatingElements();

    // Animation des images flottantes (stories/œuvres)
    this.animateFloatingImages();

    // Animation parallax au scroll
    if (this.heroContainer?.nativeElement) {
      gsap.to(this.heroContainer.nativeElement, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: this.heroContainer.nativeElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  }

  private animateFloatingElements(): void {
    if (!this.floatingElements?.nativeElement) return;
    
    const elements = this.floatingElements.nativeElement.children;
    
    Array.from(elements).forEach((element: any, index: number) => {
      // Animation flottante continue
      gsap.to(element, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        scale: "random(0.8, 1.2)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.3
      });

      // Animation d'apparition en spirale
      gsap.fromTo(element,
        {
          opacity: 0,
          scale: 0,
          rotation: "random(-360, 360)",
          x: "random(-200, 200)",
          y: "random(-200, 200)"
        },
        {
          opacity: 0.15,
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
          duration: 2,
          ease: "power3.out",
          delay: 1.5 + index * 0.2
        }
      );
    });
  }

  private animateFloatingImages(): void {
    if (!this.floatingImages?.nativeElement) return;
    
    const imageContainers = this.floatingImages.nativeElement.children;
    
    Array.from(imageContainers).forEach((container: any, index: number) => {
      const imageWrapper = container.querySelector('.floating-image-wrapper');
      const image = container.querySelector('.floating-image');
      
      // Animation d'apparition en fade-in retardé
      gsap.fromTo(container,
        {
          opacity: 0,
          scale: 0.5,
          y: 50,
          rotationY: 180
        },
        {
          opacity: 0.4, // Opacité faible pour effet subtil
          scale: 1,
          y: 0,
          rotationY: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 2 + index * 0.8 // Apparition échelonnée
        }
      );

      // Animation flottante continue et subtile
      gsap.to(imageWrapper, {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        rotation: "random(-8, 8)",
        scale: "random(0.9, 1.1)",
        duration: "random(6, 12)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.5
      });

      // Effet de pulsation de l'opacité (comme des memories qui apparaissent/disparaissent)
      gsap.to(container, {
        opacity: "random(0.2, 0.6)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 1.2
      });

      // Animation de hover pour effet interactif subtil
      container.addEventListener('mouseenter', () => {
        gsap.to(container, {
          opacity: 0.8,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(image, {
          filter: "blur(0px) brightness(1.2)",
          duration: 0.3
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(container, {
          opacity: 0.4,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        });
        gsap.to(image, {
          filter: "blur(1px) brightness(1)",
          duration: 0.5
        });
      });

      // Rotation 3D périodique pour effet de profondeur
      gsap.to(imageWrapper, {
        rotationY: "random(-25, 25)",
        rotationX: "random(-15, 15)",
        duration: "random(8, 15)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 2
      });
    });
  }

  onButtonHover(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    gsap.to(button, {
      scale: 1.1,
      rotationY: 5,
      boxShadow: "0 20px 40px rgba(14, 165, 233, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    });
  }

  onButtonLeave(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    gsap.to(button, {
      scale: 1,
      rotationY: 0,
      boxShadow: "0 10px 20px rgba(14, 165, 233, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
  }

  private startTypingAnimation(): void {
    this.typingInterval = setInterval(() => {
      const currentText = this.typingTexts[this.currentTextIndex];
      
      if (!this.isDeleting) {
        // Typing
        this.typingText = currentText.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
        
        if (this.currentCharIndex === currentText.length) {
          this.isDeleting = true;
          setTimeout(() => {}, this.pauseTime);
        }
      } else {
        // Deleting
        this.typingText = currentText.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;
        
        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
        }
      }
    }, this.isDeleting ? this.deletingSpeed : this.typingSpeed);
  }

  private initThreeJS(): void {
    if (!this.threeContainer?.nativeElement) return;

    // Initialiser la scène Three.js
    const { scene, camera, renderer } = this.threeService.initScene(
      this.threeContainer.nativeElement,
      {
        backgroundAlpha: 0,
        cameraPosition: { x: 0, y: 0, z: 10 }
      }
    );

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Créer les éléments 3D
    this.particles = this.threeService.createFloatingParticles(scene, 150);
    this.floatingCrystals = this.threeService.createFloatingCrystals(scene);
    this.morphingGeo = this.threeService.createMorphingGeometry(scene);

    // Positionner la géométrie morphante
    this.morphingGeo.position.set(5, 2, -3);
    this.morphingGeo.scale.set(0.5, 0.5, 0.5);

    // Démarrer l'animation
    this.animate();
  }

  private setupMouseTracking(): void {
    if (!this.heroContainer?.nativeElement) return;

    this.heroContainer.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.heroContainer.nativeElement.getBoundingClientRect();
      this.mousePos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Effet parallax sur la caméra
      if (this.camera) {
        gsap.to(this.camera.position, {
          x: this.mousePos.x * 0.5,
          y: this.mousePos.y * 0.3,
          duration: 2,
          ease: "power2.out"
        });
      }
    });
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    const time = Date.now();

    // Animer les particules
    if (this.particles) {
      this.threeService.animateParticles(this.particles, time);
    }

    // Animer les cristaux flottants
    if (this.floatingCrystals) {
      this.threeService.animateFloatingCrystals(this.floatingCrystals, time, this.mousePos);
    }

    // Animer la géométrie morphante
    if (this.morphingGeo) {
      const material = this.morphingGeo.material as THREE.ShaderMaterial;
      material.uniforms['time'].value = time * 0.001;
      
      this.morphingGeo.rotation.x = time * 0.0005;
      this.morphingGeo.rotation.y = time * 0.001;
    }

    // Rotation globale de la scène basée sur la souris
    if (this.scene) {
      this.scene.rotation.y = this.mousePos.x * 0.1;
      this.scene.rotation.x = this.mousePos.y * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
