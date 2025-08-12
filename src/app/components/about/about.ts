import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit, AfterViewInit {
  @ViewChild('aboutContainer', { static: false }) aboutContainer!: ElementRef;
  @ViewChild('statsContainer', { static: false }) statsContainer!: ElementRef;
  @ViewChild('skillsContainer', { static: false }) skillsContainer!: ElementRef;

  // Données animées
  stats = [
    { label: 'Projets Réalisés', value: 0, target: 150, suffix: '+', icon: '🎨' },
    { label: 'Clients Satisfaits', value: 0, target: 95, suffix: '%', icon: '😊' },
    { label: 'Heures de Création', value: 0, target: 2000, suffix: '+', icon: '⏱️' },
    { label: 'Styles Maîtrisés', value: 0, target: 25, suffix: '+', icon: '🌈' }
  ];

  skills = [
    { name: 'Midjourney', level: 0, target: 95, color: '#FF6B6B' },
    { name: 'Leonardo AI', level: 0, target: 90, color: '#4ECDC4' },
    { name: 'Photoshop', level: 0, target: 85, color: '#45B7D1' },
    { name: 'Fotor', level: 0, target: 80, color: '#96CEB4' },
    { name: 'Prompt Engineering', level: 0, target: 98, color: '#FFEAA7' },
    { name: 'Post-Production', level: 0, target: 88, color: '#DDA0DD' }
  ];

  experiences = [
    {
      title: 'Expert en IA Générative',
      company: 'Freelance',
      period: '2023 - Présent',
      description: 'Spécialisé dans la création d\'images via IA avec focus sur Midjourney et Leonardo AI'
    },
    {
      title: 'Designer Visuel',
      company: 'Studio Créatif',
      period: '2022 - 2023',
      description: 'Post-production et retouche d\'images professionnelles avec Photoshop'
    },
    {
      title: 'Créateur de Contenu',
      company: 'Projets Personnels',
      period: '2021 - 2022',
      description: 'Développement de techniques de prompt engineering et exploration des outils IA'
    }
  ];

  ngOnInit(): void {
    // Initialisation
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    // Animation des statistiques au scroll
    if (this.statsContainer?.nativeElement) {
      ScrollTrigger.create({
        trigger: this.statsContainer.nativeElement,
        start: "top 80%",
        onEnter: () => this.animateStats()
      });
    }

    // Animation des barres de compétences
    if (this.skillsContainer?.nativeElement) {
      ScrollTrigger.create({
        trigger: this.skillsContainer.nativeElement,
        start: "top 70%",
        onEnter: () => this.animateSkills()
      });
    }

    // Animation d'entrée des sections
    this.animateSections();
  }

  private animateStats(): void {
    this.stats.forEach((stat, index) => {
      gsap.to(stat, {
        value: stat.target,
        duration: 2,
        ease: "power2.out",
        delay: index * 0.2,
        onUpdate: () => {
          stat.value = Math.round(stat.value);
        }
      });

      // Animation des cartes de stats
      const statCard = this.statsContainer.nativeElement.children[index];
      if (statCard) {
        gsap.fromTo(statCard,
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
            rotationY: 25
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.15
          }
        );
      }
    });
  }

  private animateSkills(): void {
    this.skills.forEach((skill, index) => {
      // Animation des barres de progression
      gsap.to(skill, {
        level: skill.target,
        duration: 1.5,
        ease: "power2.out",
        delay: index * 0.1,
        onUpdate: () => {
          skill.level = Math.round(skill.level);
        }
      });

      // Animation d'apparition des éléments
      const skillElement = this.skillsContainer.nativeElement.children[index];
      if (skillElement) {
        gsap.fromTo(skillElement,
          {
            opacity: 0,
            x: -50,
            skewX: 5
          },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1
          }
        );
      }
    });
  }

  private animateSections(): void {
    // Animation des titres de section
    const titles = this.aboutContainer?.nativeElement.querySelectorAll('h2, h3');
    if (titles) {
      gsap.fromTo(titles,
        {
          opacity: 0,
          y: 30,
          skewY: 2
        },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: this.aboutContainer.nativeElement,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animation des cartes d'expérience
    const experienceCards = this.aboutContainer?.nativeElement.querySelectorAll('.experience-card');
    if (experienceCards) {
      gsap.fromTo(experienceCards,
        {
          opacity: 0,
          x: 100,
          rotationY: 15
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: experienceCards[0],
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }

  onStatHover(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
      y: -10,
      scale: 1.05,
      rotationY: 5,
      boxShadow: "0 20px 40px rgba(14, 165, 233, 0.2)",
      duration: 0.3,
      ease: "power2.out"
    });
  }

  onStatLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
      y: 0,
      scale: 1,
      rotationY: 0,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
  }

  trackByStatLabel(index: number, stat: any): string {
    return stat.label;
  }

  trackBySkillName(index: number, skill: any): string {
    return skill.name;
  }
}
