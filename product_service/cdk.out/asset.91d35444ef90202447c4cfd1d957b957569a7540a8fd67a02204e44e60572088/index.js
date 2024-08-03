"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/src/product-api.ts
var product_api_exports = {};
__export(product_api_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(product_api_exports);

// asset-input/src/utility/response.ts
var formatResponse = (statusCode, message, data) => {
  if (data) {
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        data
      })
    };
  } else {
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message
      })
    };
  }
};
var SucessResponse = (data) => {
  return formatResponse(200, "success", data);
};
var ErrorResponse = (code = 1e3, error) => {
  if (Array.isArray(error)) {
    const errorObject = error[0].constraints;
    const errorMesssage = errorObject[Object.keys(errorObject)[0]] || "Error Occured";
    return formatResponse(code, errorMesssage, errorMesssage);
  }
  return formatResponse(code, `${error}`, error);
};

// asset-input/src/service/product-service.ts
var ProductService = class {
  constructor(repository) {
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
};

// asset-input/src/repository/product-repository.ts
var ProductRepository = class {
  constructor() {
  }
  //we will add some code to intereact with DB
};

// asset-input/src/product-api.ts
var service = new ProductService(new ProductRepository());
var handler = async (event, context) => {
  const isRoot = event.pathParameters === null;
  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createProduct();
      }
      break;
    case "get":
      return isRoot ? service.getProduct() : service.getProduct();
    case "put":
      if (!isRoot) {
        return service.editProduct();
      }
    case "delete":
      if (!isRoot) {
        return service.deleteProduct();
      }
  }
  return ErrorResponse(404, "requested method not allowed!");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
