import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { ErrorResponse, SucessResponse } from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { AddItemInput, CategoryInput } from "../dto/category-input";
import { categories, CategoryDoc } from "../models";
import { off } from "process";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("method not allowed!"));
  }

  async createCategory(event: APIGatewayEvent) {
    const input = plainToClass(CategoryInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);
    const data = await this._repository.createCategory(input);
    return SucessResponse(data);
  }

  async getCategories(event: APIGatewayEvent) {
    //add query to select
    const type = event.queryStringParameters?.type;
    if (type === "top") {
      const data = await this._repository.getTopCategories();
      return SucessResponse(data);
    }
    const data = await this._repository.getAllCategories();
    return SucessResponse(data);
  }

  async getCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    const offset = Number(event.queryStringParameters?.offset);
    const perPage = Number(event.queryStringParameters?.perPage);

    if (!categoryId) return ErrorResponse(403, "please provide category id");
    const data = await this._repository.getCategoryById(
      categoryId,
      offset,
      perPage
    );
    return SucessResponse(data);
  }

  async editCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return ErrorResponse(403, "please provide category id");
    const input = plainToClass(CategoryInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);
    input.id = categoryId;
    const data = await this._repository.updateCategory(input);
    return SucessResponse(data);
  }

  async deleteCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return ErrorResponse(403, "please provide category id");
    const data = await this._repository.deleteCategory(categoryId);
    return SucessResponse(data);
  }
}
