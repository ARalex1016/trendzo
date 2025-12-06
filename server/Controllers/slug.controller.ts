import type { Request, Response } from "express";

// Models
import Product from "../Models/product.model.ts";
import Category from "../Models/category.model.ts";

// Utils
import { generateUniqueSlugs, isSlugAvailable } from "../Utils/slugManager.ts";

export const suggestSlug = async (req: Request, res: Response) => {
  try {
    const { model: modelName, field, value } = req.query;

    if (!modelName || !field || !value) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required query params",
      });
    }

    // Determine model
    let model;
    switch (modelName) {
      case "Product":
        model = Product;
        break;
      case "Category":
        model = Category;
        break;
      default:
        return res.status(400).json({
          status: "fail",
          message: "Invalid model name",
        });
    }

    const slugs = await generateUniqueSlugs(
      model,
      field as string,
      value as string,
      5
    );

    // Success logic here
    res.status(200).json({
      status: "success",
      data: slugs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const checkSlug = async (req: Request, res: Response) => {
  try {
    const { model: modelName, field, value } = req.query;
    if (!modelName || !field || !value) {
      return res
        .status(400)
        .json({ status: "fail", message: "Missing required query params" });
    }

    let model;
    switch (modelName) {
      case "Product":
        model = Product;
        break;
      case "Category":
        model = Category;
        break;
      default:
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid model name" });
    }

    const available = await isSlugAvailable(
      model,
      field as string,
      value as string
    );

    // Success logic here
    res.status(200).json({
      status: "success",
      data: {
        available,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
