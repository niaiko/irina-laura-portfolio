import { Injectable } from '@angular/core';

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  tool: string;
  category: 'portrait' | 'landscape' | 'abstract' | 'character' | 'concept';
}

@Injectable({
  providedIn: 'root'
})
export class Gallery {
  private galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: "Microsoft Clarity - Analyser le comportement des visiteurs",
      description: "Représentation réaliste créée avec Midjourney et retouchée sur Photoshop",
      imageUrl: "images/ms-image.jpg",
      tags: ["Microsoft", "Clarity", "Outils"],
      tool: "Midjourney + Photoshop",
      category: "portrait"
    },
    {
      id: 2,
      title: "Fitness diète",
      description: "Illustration d'app d'entraînement pour débutants",
      imageUrl: "images/fiteness-pal.png",
      tags: ["fitness", "app", "débutant"],
      tool: "Midjourney + Leonardo AI",
      category: "landscape"
    },
    {
      id: 3,
      title: "Corde sauter - sport",
      description: "Visuel sprotif avec corde à sauter",
      imageUrl: "images/corde-sauter.png",
      tags: ["seo", "marketing", "blog"],
      tool: "Leonardo AI + Photoshop",
      category: "abstract"
    },
    {
      id: 4,
      title: "Hébergement web Infomaniak",
      description: "Créa promotionnelle hébergement web écoresponsable",
      imageUrl: "images/hebergement-web.png",
      tags: ["hébergement", "infomaniak", "web"],
      tool: "Photoshop",
      category: "concept"
    },
    {
      id: 5,
      title: "COP",
      description: "La Conférence des Parties est l'organe décisionnel suprême de la Convention",
      imageUrl: "images/cop-image.png",
      tags: ["navigateur", "moteur", "guide"],
      tool: "Midjourney + Photoshop",
      category: "character"
    },
    {
      id: 6,
      title: "Content Creation",
      description: "Icône et visuel pour création de contenu",
      imageUrl: "images/content-creation.png",
      tags: ["content", "social", "design"],
      tool: "Fotor AI + Photoshop",
      category: "portrait"
    }
  ];

  constructor() { }

  getAllItems(): GalleryItem[] {
    return this.galleryItems;
  }

  getItemsByCategory(category: string): GalleryItem[] {
    if (category === 'all') return this.galleryItems;
    return this.galleryItems.filter(item => item.category === category);
  }

  getItemById(id: number): GalleryItem | undefined {
    return this.galleryItems.find(item => item.id === id);
  }

  getCategories(): string[] {
    return ['all', 'portrait', 'landscape', 'abstract', 'character', 'concept'];
  }
}
