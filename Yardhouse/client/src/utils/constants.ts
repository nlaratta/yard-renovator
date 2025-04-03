/**
 * @fileoverview Application constants and static data
 */

import { RenovationTheme, RenovationLevel } from '../types';

/**
 * Renovation themes for yard transformation
 */
export const RENOVATION_THEMES: RenovationTheme[] = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean lines, geometric patterns, and minimal color palette. Features concrete pavers, structural plants, and zen elements.'
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    description: 'Lush vegetation, vibrant colors, and resort-like features. Features palm trees, colorful flora, and water elements.'
  },
  {
    id: 'classic-garden',
    name: 'Classic Garden',
    description: 'Traditional landscaping with formal structure and timeless elements. Features symmetrical designs, flowering perennials, and decorative hedges.'
  },
  {
    id: 'rustic-retreat',
    name: 'Rustic Retreat',
    description: 'Natural materials, cottage-style plantings, and cozy gathering spaces. Features stone pathways, wildflowers, and wooden elements.'
  },
  {
    id: 'desert-oasis',
    name: 'Desert Oasis',
    description: 'Drought-resistant design with sculptural plants and earthy tones. Features succulents, gravel, and architectural accents.'
  },
  {
    id: 'urban-terrace',
    name: 'Urban Terrace',
    description: 'Space-efficient design with vertical elements and multipurpose features. Features container gardens, living walls, and modular furniture.'
  }
];

/**
 * Renovation levels for transformation intensity
 */
export const RENOVATION_LEVELS: RenovationLevel[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Basic redesign with fundamental improvements. Limited plant varieties and simpler hardscaping. Most affordable option.'
  },
  {
    id: 'enhanced',
    name: 'Enhanced',
    description: 'Comprehensive redesign with quality materials. Greater plant diversity and more detailed features. Mid-range investment.'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury transformation with premium materials. Extensive plant selection, custom features, and unique elements. High-end investment.'
  }
]; 