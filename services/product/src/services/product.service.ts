import { productRepo } from '../repositories/product.repository';

export const productService = {
  list: (page?: number, pageSize?: number) => productRepo.list(page, pageSize),
};
