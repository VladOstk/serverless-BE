import { Product } from './get-products.models';

const mockedProducts: Product[] = [
  {
    count: 33,
    description: 'Test Product 1',
    id: '1',
    price: 3.33,
    title: 'Test Title 1',
  },
  {
    count: 2,
    description: 'Test Product 2',
    id: '2',
    price: 2.33,
    title: 'Test Title 2',
  },
];

export const getProducts: () => Product[] = () => mockedProducts;

export const getProductById: (id: string) => Product = (id: string) =>
  mockedProducts.find((product) => product.id === id) ?? null;
