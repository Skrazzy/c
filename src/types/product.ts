export interface Product {
  name?: string;
  price: number;
  image?: string;
}

export interface ProductOffer {
  name?: string;
  price: number;
  image?: string;
  percent: number;
}

export interface CartApp {
  product: Product;
  productOffer: ProductOffer;
}
