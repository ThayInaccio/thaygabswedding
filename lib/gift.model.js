"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftModel = void 0;
var db_config_1 = require("./db.config");
var uuid_1 = require("uuid");
var GiftModel = /** @class */ (function () {
    function GiftModel() {
    }
    GiftModel.create = function (giftData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, query, values, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (0, uuid_1.v4)();
                        query = "\n      INSERT INTO gifts (id, name, description, price, image_url, is_reserved, reserved_by, reserved_at)\n      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n      RETURNING *\n    ";
                        values = [
                            id,
                            giftData.name,
                            giftData.description,
                            giftData.price,
                            giftData.image_url || null,
                            giftData.is_reserved,
                            giftData.reserved_by || null,
                            giftData.reserved_at || null,
                        ];
                        return [4 /*yield*/, db_config_1.default.query(query, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    GiftModel.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM gifts ORDER BY created_at DESC';
                        return [4 /*yield*/, db_config_1.default.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    GiftModel.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM gifts WHERE id = $1';
                        return [4 /*yield*/, db_config_1.default.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    GiftModel.update = function (id, giftData) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, values, setClause, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = Object.keys(giftData).filter(function (key) { return key !== 'id' && key !== 'created_at'; });
                        values = Object.values(giftData).filter(function (_, index) { return fields[index]; });
                        if (fields.length === 0)
                            return [2 /*return*/, null];
                        setClause = fields.map(function (field, index) { return "".concat(field, " = $").concat(index + 2); }).join(', ');
                        query = "UPDATE gifts SET ".concat(setClause, " WHERE id = $1 RETURNING *");
                        return [4 /*yield*/, db_config_1.default.query(query, __spreadArray([id], values, true))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    GiftModel.reserve = function (id, reservedBy) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      UPDATE gifts \n      SET is_reserved = true, reserved_by = $2, reserved_at = NOW()\n      WHERE id = $1 AND is_reserved = false\n      RETURNING *\n    ";
                        return [4 /*yield*/, db_config_1.default.query(query, [id, reservedBy])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    GiftModel.unreserve = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      UPDATE gifts \n      SET is_reserved = false, reserved_by = NULL, reserved_at = NULL\n      WHERE id = $1\n      RETURNING *\n    ";
                        return [4 /*yield*/, db_config_1.default.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    GiftModel.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'DELETE FROM gifts WHERE id = $1';
                        return [4 /*yield*/, db_config_1.default.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!(result && result.rowCount && result.rowCount > 0)];
                }
            });
        });
    };
    return GiftModel;
}());
exports.GiftModel = GiftModel;
