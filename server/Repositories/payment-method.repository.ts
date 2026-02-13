import { Types, type ClientSession } from "mongoose";

// Models
import PaymentMethod, {
  type IPaymentMethod,
} from "../Models/payment-method.model.ts";

export const PaymentMethodRepository = {
  async create(
    data: Partial<IPaymentMethod>,
    session?: ClientSession
  ): Promise<IPaymentMethod> {
    const paymentMethod = new PaymentMethod(data);
    if (session) paymentMethod.$session(session);
    return paymentMethod.save();
  },

  async update(
    methodId: Types.ObjectId,
    data: Partial<IPaymentMethod>,
    session?: ClientSession
  ) {
    return PaymentMethod.findByIdAndUpdate(methodId, data).session(
      session ?? null
    );
  },

  async updateByUserId(
    query: any,
    data: Partial<IPaymentMethod>,
    session?: ClientSession
  ) {
    return PaymentMethod.updateOne(query, data).session(session ?? null);
  },

  async setDefault(methodId: Types.ObjectId, session?: ClientSession) {
    return PaymentMethod.findByIdAndUpdate(
      methodId,
      { isDefault: true },
      { runValidators: true, new: true }
    ).session(session ?? null);
  },

  async findAllByUser(
    userId: Types.ObjectId,
    session?: ClientSession
  ): Promise<IPaymentMethod[] | null> {
    return PaymentMethod.find({ user: userId }).session(session ?? null);
  },

  async findByIdAndUser(
    methodId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession
  ): Promise<IPaymentMethod | null> {
    return PaymentMethod.findOne({ user: userId, _id: methodId }).session(
      session ?? null
    );
  },

  async findById(
    methodId: Types.ObjectId,
    session?: ClientSession
  ): Promise<IPaymentMethod | null> {
    return PaymentMethod.findById(methodId).session(session ?? null);
  },

  async delete(methodId: Types.ObjectId, session?: ClientSession) {
    return PaymentMethod.findByIdAndDelete(methodId).session(session ?? null);
  },
};
