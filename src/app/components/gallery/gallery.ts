import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gallery as GalleryService, GalleryItem } from '../../services/gallery';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeService } from '../../services/three.service';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('galleryContainer', { static: false }) galleryContainer!: ElementRef;
  @ViewChild('filterButtons', { static: false }) filterButtons!: ElementRef;
  @ViewChild('threeBackground', { static: false }) threeBackground!: ElementRef;

  // Three.js objects
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private interactiveGrid: THREE.Group | null = null;
  private animationId: number | null = null;
  private mousePos = { x: 0, y: 0 };

  categories: string[] = [];
  selectedCategory = 'all';
  allItems: GalleryItem[] = [];
  filteredItems: GalleryItem[] = [];
  displayedItems: GalleryItem[] = [];
  selectedItem: GalleryItem | null = null;
  itemsPerPage = 6;
  currentPage = 1;

  constructor(private galleryService: GalleryService, private threeService: ThreeService) {}

  ngOnInit(): void {
    this.categories = this.galleryService.getCategories();
    this.allItems = this.galleryService.getAllItems();
    this.filterByCategory('all');
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.initThreeJSBackground();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.threeService.dispose();
  }

  private initScrollAnimations(): void {
    // Animation des boutons de filtre
    if (this.filterButtons?.nativeElement) {
      gsap.fromTo(this.filterButtons.nativeElement.children,
        {
          opacity: 0,
          y: 30,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: this.filterButtons.nativeElement,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animation des éléments de galerie au chargement initial
    this.animateGalleryItems();
  }

  private animateGalleryItems(): void {
    // Délai pour permettre au DOM de se mettre à jour
    setTimeout(() => {
      const galleryItems = this.galleryContainer?.nativeElement.querySelectorAll('.gallery-item');
      if (galleryItems) {
        gsap.fromTo(galleryItems,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotationY: 15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: {
              amount: 0.6,
              grid: "auto",
              from: "center"
            }
          }
        );
      }
    }, 100);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    
    // Animation de sortie des éléments actuels
    const currentItems = this.galleryContainer?.nativeElement.querySelectorAll('.gallery-item');
    if (currentItems && currentItems.length > 0) {
      gsap.to(currentItems, {
        opacity: 0,
        y: -30,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.05,
        onComplete: () => {
          // Filtrer les éléments après l'animation de sortie
          this.applyFilter(category);
          this.animateGalleryItems();
        }
      });
    } else {
      // Pas d'éléments à animer, filtrer directement
      this.applyFilter(category);
      this.animateGalleryItems();
    }
  }

  private applyFilter(category: string): void {
    this.filteredItems = this.galleryService.getItemsByCategory(category);
    this.currentPage = 1;
    this.updateDisplayedItems();
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'all': 'Tout',
      'portrait': 'Portraits',
      'landscape': 'Paysages',
      'abstract': 'Abstrait',
      'character': 'Personnages',
      'concept': 'Concept Art'
    };
    return labels[category] || category;
  }

  trackByItemId(index: number, item: GalleryItem): number {
    return item.id;
  }

  openLightbox(item: GalleryItem): void {
    this.selectedItem = item;
    document.body.style.overflow = 'hidden';
    
    // Animation d'ouverture du lightbox
    setTimeout(() => {
      const lightbox = document.querySelector('.lightbox-overlay');
      const lightboxContent = document.querySelector('.lightbox-content');
      
      if (lightbox && lightboxContent) {
        gsap.fromTo(lightbox, 
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        
        gsap.fromTo(lightboxContent,
          { 
            opacity: 0, 
            scale: 0.8,
            rotationY: 15
          },
          { 
            opacity: 1, 
            scale: 1,
            rotationY: 0,
            duration: 0.5, 
            ease: "back.out(1.7)",
            delay: 0.1
          }
        );
      }
    }, 10);
  }

  closeLightbox(): void {
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxContent = document.querySelector('.lightbox-content');
    
    if (lightbox && lightboxContent) {
      gsap.to(lightboxContent, {
        opacity: 0,
        scale: 0.8,
        rotationY: -15,
        duration: 0.3,
        ease: "power2.in"
      });
      
      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.1,
        onComplete: () => {
          this.selectedItem = null;
          document.body.style.overflow = 'auto';
        }
      });
    } else {
      this.selectedItem = null;
      document.body.style.overflow = 'auto';
    }
  }

  onItemHover(event: MouseEvent): void {
    const item = event.currentTarget as HTMLElement;
    const image = item.querySelector('img');
    const overlay = item.querySelector('.item-overlay');
    
    gsap.to(item, {
      y: -10,
      rotationY: 5,
      boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (image) {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  onItemLeave(event: MouseEvent): void {
    const item = event.currentTarget as HTMLElement;
    const image = item.querySelector('img');
    const overlay = item.querySelector('.item-overlay');
    
    gsap.to(item, {
      y: 0,
      rotationY: 0,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
    
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  get hasMoreItems(): boolean {
    return this.displayedItems.length < this.filteredItems.length;
  }

  loadMoreItems(): void {
    this.currentPage++;
    this.updateDisplayedItems();
  }

  private updateDisplayedItems(): void {
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedItems = this.filteredItems.slice(0, endIndex);
  }
  
  private initThreeJSBackground(): void {
    if (!this.threeBackground?.nativeElement) return;

    // Initialiser la scène Three.js en arrière-plan
    const { scene, camera, renderer } = this.threeService.initScene(
      this.threeBackground.nativeElement,
      {
        backgroundAlpha: 0,
        cameraPosition: { x: 0, y: 0, z: 15 }
      }
    );

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Créer une grille interactive
    this.interactiveGrid = this.threeService.createInteractiveGrid(scene, 30);

    // Setup mouse tracking pour la galerie
    this.setupGalleryMouseTracking();

    // Démarrer l'animation
    this.animateBackground();
  }

  private setupGalleryMouseTracking(): void {
    if (!this.galleryContainer?.nativeElement) return;

    this.galleryContainer.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.galleryContainer.nativeElement.getBoundingClientRect();
      this.mousePos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
  }

  private animateBackground(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationId = requestAnimationFrame(() => this.animateBackground());

    const time = Date.now();

    // Animer la grille interactive
    if (this.interactiveGrid) {
      this.threeService.animateGrid(this.interactiveGrid, time, this.mousePos);
    }

    // Rotation subtile de la scène
    if (this.scene) {
      this.scene.rotation.z = Math.sin(time * 0.0005) * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
