import { cartRepo } from '../repositories/cart.respository';

function calcTotals(items: Array<{ quantity: number; unitPrice: any }>) {
  let total = 0;
  for (const it of items) {
    const price = Number(it.unitPrice);
    total += it.quantity * price;
  }
  return { total, currency: 'USD' }; // adapt as needed
}

export const cartService = {
  getMyCart: async (userId: string) => {
    const cart = await cartRepo.getCartWithItems(userId);
    if (!cart) return { items: [], totals: { total: 0, currency: 'USD' } };
    const totals = calcTotals(cart.items);
    return { cartId: cart.id, items: cart.items, totals };
  },

  addToCart: async (userId: string, productId: string, qty = 1) => {
    const item = await cartRepo.addOrIncrement(userId, productId, qty);
    const updated = await cartRepo.getCartWithItems(userId);
    const totals = calcTotals(updated?.items ?? []);
    return { item, cart: { id: updated?.id, items: updated?.items ?? [], totals } };
  },

  setQuantity: async (userId: string, itemId: string, quantity: number) => {
    await cartRepo.setQuantity(userId, itemId, quantity);
    const updated = await cartRepo.getCartWithItems(userId);
    const totals = calcTotals(updated?.items ?? []);
    return { cart: { id: updated?.id, items: updated?.items ?? [], totals } };
  },

  removeItem: async (userId: string, itemId: string) => {
    await cartRepo.removeItem(userId, itemId);
    const updated = await cartRepo.getCartWithItems(userId);
    const totals = calcTotals(updated?.items ?? []);
    return { cart: { id: updated?.id, items: updated?.items ?? [], totals } };
  },
};
