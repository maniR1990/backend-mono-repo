import { prisma } from '../infra/db/prisma';
import type { Prisma } from '@prisma/client';

export const cartRepo = {
  getOrCreateCart: async (userId: string) => {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  },

  getCartWithItems: async (userId: string) => {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, price: true, stock: true } },
          },
        },
      },
    });
  },

  addOrIncrement: async (userId: string, productId: string, qty: number) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || !product.isActive) throw new Error('PRODUCT_NOT_FOUND');
      if (product.stock < qty) throw new Error('OUT_OF_STOCK');

      // upsert -> increment quantity
      const item = await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity: qty, unitPrice: product.price },
        update: { quantity: { increment: qty } },
      });

      // (Optional) reserve stock here if you want: decrement product.stock
      // await tx.product.update({ where: { id: productId }, data: { stock: { decrement: qty } } });

      return item;
    });
  },

  setQuantity: async (userId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const item = await tx.cartItem.findUnique({ where: { id: itemId } });
        if (!item) throw new Error('ITEM_NOT_FOUND');
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (!cart || cart.id !== item.cartId) throw new Error('FORBIDDEN');
        await tx.cartItem.delete({ where: { id: itemId } });
        return { deleted: true };
      });
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const item = await tx.cartItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });
      if (!item) throw new Error('ITEM_NOT_FOUND');
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (!cart || cart.id !== item.cartId) throw new Error('FORBIDDEN');

      if (!item.product?.isActive) throw new Error('PRODUCT_NOT_FOUND');
      if (item.product.stock < quantity) throw new Error('OUT_OF_STOCK');

      return tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
    });
  },

  removeItem: async (userId: string, itemId: string) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const item = await tx.cartItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error('ITEM_NOT_FOUND');
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (!cart || cart.id !== item.cartId) throw new Error('FORBIDDEN');
      await tx.cartItem.delete({ where: { id: itemId } });
      return { deleted: true };
    });
  },
};
