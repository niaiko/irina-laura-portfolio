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
      title: "Portrait Cyberpunk",
      description: "Portrait futuriste créé avec Midjourney et retouché sur Photoshop",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=800&fit=crop",
      tags: ["cyberpunk", "portrait", "futuristic"],
      tool: "Midjourney + Photoshop",
      category: "portrait"
    },
    {
      id: 2,
      title: "Paysage Fantastique",
      description: "Paysage onirique généré avec Leonardo AI",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      tags: ["landscape", "fantasy", "dreamy"],
      tool: "Leonardo AI",
      category: "landscape"
    },
    {
      id: 3,
      title: "Art Abstrait",
      description: "Composition abstraite créée avec Fotor AI",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
      tags: ["abstract", "colorful", "modern"],
      tool: "Fotor AI",
      category: "abstract"
    },
    {
      id: 4,
      title: "Concept Art - Véhicule",
      description: "Design conceptuel de véhicule futuriste",
      imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=500&fit=crop",
      tags: ["concept", "vehicle", "design"],
      tool: "Midjourney + Photoshop",
      category: "concept"
    },
    {
      id: 5,
      title: "Personnage Fantasy",
      description: "Création de personnage pour univers fantasy",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop",
      tags: ["character", "fantasy", "rpg"],
      tool: "Leonardo AI + Photoshop",
      category: "character"
    },
    {
      id: 6,
      title: "Architecture Futuriste",
      description: "Visualisation architecturale avec IA",
      imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop",
      tags: ["architecture", "futuristic", "building"],
      tool: "Midjourney",
      category: "concept"
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
