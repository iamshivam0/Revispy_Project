import User from "../models/User.js";
import { faker } from "@faker-js/faker";

const generateFakeCategories = () => {
  try {
    const categories = [];
    const uniqueNames = new Set();

    while (categories.length < 100) {
      let baseName = faker.commerce.department();
      let candidateName = baseName;
      let suffix = 1;

      while (uniqueNames.has(candidateName)) {
        candidateName = `${baseName} ${suffix++}`;
      }

      uniqueNames.add(candidateName);
      categories.push({
        id: faker.string.uuid(),
        name: candidateName,
        productCount: faker.number.int({ min: 10, max: 1000 }),
        createdAt: faker.date.past(),
      });
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const FAKE_CATEGORIES = generateFakeCategories();

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Items per page
    const skip = (page - 1) * limit;
    const total = FAKE_CATEGORIES.length;

    const user = await User.findById(req.user._id).select("categories");
    const userCategories = user?.categories || [];

    const categoriesWithSelection = FAKE_CATEGORIES.map((cat) => ({
      ...cat,
      selected: userCategories.includes(cat.name),
    }));

    const paginatedCategories = categoriesWithSelection.slice(
      skip,
      skip + limit
    );

    return res.json({
      categories: paginatedCategories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCategories: total,
      hasMore: skip + limit < total,
      selectedCategories: userCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

export const updateUserCategories = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "Invalid categories provided" });
    }

    const validCategories = categories.filter((cat) =>
      FAKE_CATEGORIES.some((fakeCategory) => fakeCategory.name === cat)
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { categories: validCategories },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "Categories updated successfully",
      categories: user.categories,
    });
  } catch (error) {
    console.error("Error updating categories:", error);
    return res
      .status(500)
      .json({ message: "Error updating categories", error: error.message });
  }
};
