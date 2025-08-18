import { Type } from '@sinclair/typebox';

export const AddToCartBody = Type.Object({
  productId: Type.String(),
  quantity: Type.Optional(Type.Integer({ minimum: 1 })),
});

export const SetQuantityBody = Type.Object({
  quantity: Type.Integer({ minimum: 0 }), // 0 => remove
});
