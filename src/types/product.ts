/**
 * Tipos relacionados a produtos, cardápios e quiosques
 */

export interface Kiosk {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address: Address;
  contact: ContactInfo;
  operatingHours: OperatingHours[];
  isActive: boolean;
  isPublic: boolean;
  licenseExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  settings: KioskSettings;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  phone: string;
  whatsapp?: string;
  email: string;
  instagram?: string;
  facebook?: string;
}

export interface OperatingHours {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export type DayOfWeek = 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday';

export interface KioskSettings {
  allowOnlineOrders: boolean;
  allowTableOrders: boolean;
  requirePaymentUpfront: boolean;
  estimatedPrepTime: number;
  maxOrdersPerHour: number;
  notificationEmail: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface Category {
  id: string;
  kioskId: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  kioskId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  images: string[];
  isAvailable: boolean;
  isHighlighted: boolean;
  preparationTime: number;
  recipeId?: string;
  nutritionalInfo?: NutritionalInfo;
  allergens: Allergen[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalInfo {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  sodium: number;
  fiber: number;
}

export type Allergen = 
  | 'gluten'
  | 'lactose'
  | 'nuts'
  | 'eggs'
  | 'soy'
  | 'seafood'
  | 'peanuts';

export interface Menu {
  id: string;
  kioskId: string;
  name: string;
  description?: string;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
  categories: MenuCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  categoryId: string;
  order: number;
  products: MenuProduct[];
}

export interface MenuProduct {
  productId: string;
  order: number;
  isAvailable: boolean;
  customPrice?: number;
}

export interface ProductAddon {
  id: string;
  productId: string;
  name: string;
  price: number;
  isRequired: boolean;
  maxQuantity: number;
  options: AddonOption[];
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

