import OrderItem from "../Models/order-item.model.ts";

export const OrderItemRepository = {
  create(data: any, session?: any) {
    const item = new OrderItem(data);
    return item.save({ session });
  },

  findManyByIds(ids: any[], session?: any) {
    return OrderItem.find({ _id: { $in: ids } }).session(session ?? null);
  },
};
