import type { IUser } from "../Models/user.model.ts";
import type { IProduct } from "../Models/product.model.ts";
import type { ICategory } from "../Models/category.model.ts";
import type { ICoupon } from "../Models/coupon.model.ts";
import type { IOrder } from "../Models/order.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      targetUser?: IUser;
      targetProduct?: IProduct;
      targetCategory?: ICategory;
      targetCoupon?: ICoupon;
      targetOrder?: IOrder;
    }
  }
}
