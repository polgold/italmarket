export interface ProductImage {
  id?: number;
  src: string;
  alt?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  short_description: string;
  description: string;
  images: ProductImage[];
  categories: { id: number; name: string; slug: string }[];
  stock_status?: "instock" | "outofstock" | "onbackorder";
  attributes?: { name: string; options: string[] }[];
  origin?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  image?: ProductImage | null;
  count?: number;
}

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}
