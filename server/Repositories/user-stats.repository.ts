import { Types, type UpdateQuery } from "mongoose";

// Model
import UserStats, { type IUserStats } from "../Models/user-stats.model.ts";

const UserStatsRepository = {
  async create(userId: Types.ObjectId): Promise<IUserStats> {
    const stats = new UserStats({
      user: userId,
    });

    return stats.save();
  },

  async findByUserId(userId: Types.ObjectId): Promise<IUserStats | null> {
    return UserStats.findOne({
      user: userId,
    });
  },

  async findOrCreate(userId: Types.ObjectId): Promise<IUserStats> {
    const existingStats = await UserStats.findOne({
      user: userId,
    });

    if (existingStats) {
      return existingStats;
    }

    return this.create(userId);
  },

  async updateByUserId(
    userId: Types.ObjectId,
    update: UpdateQuery<IUserStats>,
  ): Promise<IUserStats | null> {
    return UserStats.findOneAndUpdate(
      {
        user: userId,
      },
      {
        ...update,

        $setOnInsert: {
          user: userId,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  },

  async incrementFields(
    userId: Types.ObjectId,
    incrementData: Record<string, number>,
  ): Promise<IUserStats | null> {
    return UserStats.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $inc: incrementData,
      },
      {
        new: true,
        upsert: true,
      },
    );
  },

  async setFields(
    userId: Types.ObjectId,
    setData: Record<string, any>,
  ): Promise<IUserStats | null> {
    return UserStats.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: setData,
      },
      {
        new: true,
        upsert: true,
      },
    );
  },
};

export default UserStatsRepository;
