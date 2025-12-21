type DeliveryAddress = {
  city: string;
  country?: string;
};

export const DeliveryService = {
  async calculateCharge(location: DeliveryAddress): Promise<number> {
    // v1: flat rate
    return 50;

    // v2 (future):
    // if (address.city === "Kathmandu") return 40;
    // return distanceBasedCalculation(...)
  },
};
