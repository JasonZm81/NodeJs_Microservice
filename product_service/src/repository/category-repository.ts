import { AddItemInput, CategoryInput } from "../dto/category-input";
import { categories, CategoryDoc } from "../models";

export class CategoryRepository {
  constructor() {}

  async createCategory({ name, parentId, imageUrl }: CategoryInput) {
    // create a new category
    const newCategory = await categories.create({
      name,
      parentId,
      subCategory: [],
      products: [],
      imageUrl,
    });
    // if parent id exist,
    // update parent category with new sub category id
    if (parentId) {
      const parentCategory = (await categories.findById(
        parentId
      )) as CategoryDoc;
      parentCategory.subCategories = [
        ...parentCategory.subCategories,
        newCategory,
      ];
      await parentCategory.save();
    }

    // return newly create category
    return newCategory;
  }

  //main categories
  async getAllCategories(offset = 0, perPages?: number) {
    return categories
      .find({ parentId: null })
      .populate({
        path: "subCategories",
        model: "categories",
        populate: {
          path: "subCategories",
          model: "categories",
        },
      })
      .skip(offset)
      .limit(perPages ? perPages : 100);
  }

  async getTopCategories() {
    return categories
      .find(
        // ne is not equal
        // sub categories will have parentId, top categories no
        { parentId: { $ne: null } }, //give us all subcategories
        { products: {$slice: 10 } }, // filter only 10 products frm the subcategories
      )
      .populate({
          path: "products",
          model: "products",
        })
      .sort({ displayOrder: "descending" })
      .limit(10);
  }

  async getCategoryById(id: string, offset = 0, perPage?: number) {
    return categories
      .findById(id, {
        products: { $slice: [offset, perPage ? perPage : 100] },
      })
      .populate({
        path: "products",
        model: "products",
      });
  }

  async updateCategory({ id, name, displayOrder, imageUrl }: CategoryInput){
    let category = (await categories.findById(id)) as CategoryDoc;
    category.name = name;
    category.displayOrder = displayOrder;
    category.imageUrl = imageUrl;
    return category.save();
  }

  async deleteCategory(id: string){
    return categories.deleteOne({ _id: id });
  }

  async addItem({ id, products }: AddItemInput){
    let category = (await categories.findById(id)) as CategoryDoc;
    category.products = [...category.products, ...products];
    return category.save();
  }

  async removeItem({ id, products }: AddItemInput){
    let category = (await categories.findById(id)) as CategoryDoc;
    // if the products item is exist in the filter, skip/exclude it
    const excludeProducts = category.products.filter(
        (item) => !products.includes(item)
    );
    // update excluded items here
    category.products = excludeProducts;
    return category.save();
  }
}
