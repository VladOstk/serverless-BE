export interface ProductsModel {
  description: string;
  id: string;
  price: number;
  title: string;
}

export interface StocksModel {
  product_id: string;
  count: number;
}

export type ProductApiModel = ProductsModel & Pick<StocksModel, 'count'>;
