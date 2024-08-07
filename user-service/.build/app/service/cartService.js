"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const response_1 = require("../utility/response");
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const errors_1 = require("../utility/errors");
const password_1 = require("../utility/password");
const cartRepository_1 = require("../repository/cartRepository");
const cartInput_1 = require("../models/dto/cartInput");
const message_queue_1 = require("../message-queue");
let CartService = class CartService {
    constructor(repository) {
        this.repository = repository;
    }
    ResponseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.ErrorResponse)(404, "requested method is not supported!");
        });
    }
    // Cart Section
    CreateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // get user token, validate input
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(403, "authorization failed!");
                // cart input
                const input = (0, class_transformer_1.plainToClass)(cartInput_1.CartInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                // is the user has cart ? if no create one
                let currentCart = yield this.repository.findShoppingCart(payload.user_id);
                if (!currentCart)
                    currentCart = yield this.repository.createShoppingCart(payload.user_id);
                if (!currentCart) {
                    return (0, response_1.ErrorResponse)(500, "create cart failed!");
                }
                // find the item if exist
                let currentProduct = yield this.repository.findCartItemByProductId(input.productId);
                if (currentProduct) {
                    // if exist update the qty
                    yield this.repository.updateCartItemByProductId(input.productId, (currentProduct.item_qty += input.qty));
                }
                else {
                    // if does not, call Product service to get product information
                    const { data, status } = yield (0, message_queue_1.PullData)({
                        action: "PULL_PRODUCT_DATA",
                        productId: input.productId,
                    });
                    console.log("Getting Product", data);
                    if (status !== 200) {
                        return (0, response_1.ErrorResponse)(500, "failed to get product data!");
                    }
                    // convert the data to CartItemModel
                    let cartItem = data.data;
                    cartItem.cart_id = currentCart.cart_id;
                    cartItem.item_qty = input.qty;
                    // finally create cart item
                    yield this.repository.createCartItem(cartItem);
                }
                // return all cart items to client
                const cartItems = yield this.repository.findCartItemsByCartId(currentCart.cart_id);
                return (0, response_1.SucessResponse)(cartItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(500, error);
            }
            return (0, response_1.SucessResponse)({ message: "response from Create Cart" });
        });
    }
    GetCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SucessResponse)({ message: "response from Get Cart" });
        });
    }
    UpdateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SucessResponse)({ message: "response from Update Cart" });
        });
    }
    DeleteCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SucessResponse)({ message: "response from Update Cart" });
        });
    }
};
CartService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [cartRepository_1.CartRepository])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cartService.js.map