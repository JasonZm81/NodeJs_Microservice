import { ProductRepository } from "../repository/product-repository";
import { SucessResponse } from "../utility/response";

export class ProductService {
    _repository: ProductRepository;
    constructor(repository: ProductRepository) {
        this._repository = repository;
    }

    async createProduct() {
        return SucessResponse({ msg: "Product Created!" });
    }

    async getProducts() {
        return SucessResponse({ msg: "get Product!" });
    }

    async getProduct() {
        return SucessResponse({ msg: "get product by id" });
    }

    async editProduct() {
        return SucessResponse({ msg: "edit product" });
    }

    async deleteProduct() {
        return SucessResponse({ msg: "delete product" });
    }
}