import { prisma } from '../infra/db/prisma';

export const productRepo = {
  list: async (page = 1, pageSize = 20) => {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, name: true, imageUrl: true, price: true, stock: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ]);
    return { items, total, page, pageSize };
  },
  findById: (id: string) => prisma.product.findUnique({ where: { id } }),
};
