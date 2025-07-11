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
exports.RSVPModel = void 0;
var db_config_1 = require("./db.config");
var uuid_1 = require("uuid");
var RSVPModel = /** @class */ (function () {
    function RSVPModel() {
    }
    RSVPModel.create = function (rsvpData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, query, values, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (0, uuid_1.v4)();
                        query = "\n      INSERT INTO rsvps (id, name, email, attending, number_of_guests, dietary_restrictions, message, confirmed)\n      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n      RETURNING *\n    ";
                        values = [
                            id,
                            rsvpData.name,
                            rsvpData.email,
                            rsvpData.attending,
                            rsvpData.numberOfGuests,
                            rsvpData.dietaryRestrictions || null,
                            rsvpData.message || null,
                            rsvpData.confirmed,
                        ];
                        return [4 /*yield*/, db_config_1.default.query(query, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    RSVPModel.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM rsvps ORDER BY created_at DESC';
                        return [4 /*yield*/, db_config_1.default.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    RSVPModel.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!email || email.trim() === '') {
                            return [2 /*return*/, null];
                        }
                        query = 'SELECT * FROM rsvps WHERE email = $1';
                        return [4 /*yield*/, db_config_1.default.query(query, [email.trim()])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    RSVPModel.update = function (id, rsvpData) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, setClause, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(rsvpData);
                        values = Object.values(rsvpData);
                        if (keys.length === 0)
                            return [2 /*return*/, null];
                        setClause = keys.map(function (key, index) { return "".concat(key, " = $").concat(index + 2); }).join(', ');
                        query = "UPDATE rsvps SET ".concat(setClause, " WHERE id = $1 RETURNING *");
                        return [4 /*yield*/, db_config_1.default.query(query, __spreadArray([id], values, true))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    RSVPModel.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'DELETE FROM rsvps WHERE id = $1';
                        return [4 /*yield*/, db_config_1.default.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!(result && result.rowCount && result.rowCount > 0)];
                }
            });
        });
    };
    RSVPModel.findByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM rsvps WHERE name ILIKE $1 ORDER BY name';
                        return [4 /*yield*/, db_config_1.default.query(query, ["%".concat(name, "%")])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    RSVPModel.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM rsvps WHERE id = $1';
                        return [4 /*yield*/, db_config_1.default.query(query, [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0] || null];
                }
            });
        });
    };
    RSVPModel.getGuestStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      SELECT \n        COUNT(*) as total_rsvps,\n        COUNT(CASE WHEN confirmed = true THEN 1 END) as confirmed_rsvps,\n        COUNT(CASE WHEN confirmed = false THEN 1 END) as declined_rsvps,\n        COUNT(CASE WHEN confirmed IS NULL THEN 1 END) as pending_rsvps,\n        COALESCE(SUM(number_of_guests), 0) as total_guests,\n        COALESCE(SUM(CASE WHEN confirmed = true THEN number_of_guests ELSE 0 END), 0) as confirmed_guests,\n        COALESCE(SUM(CASE WHEN confirmed = false THEN number_of_guests ELSE 0 END), 0) as declined_guests,\n        COALESCE(SUM(CASE WHEN confirmed IS NULL THEN number_of_guests ELSE 0 END), 0) as pending_guests\n      FROM rsvps\n    ";
                        return [4 /*yield*/, db_config_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        stats = rows[0];
                        return [2 /*return*/, {
                                totalGuests: parseInt(stats.total_guests) || 0,
                                confirmedGuests: parseInt(stats.confirmed_guests) || 0,
                                declinedGuests: parseInt(stats.declined_guests) || 0,
                                pendingGuests: parseInt(stats.pending_guests) || 0,
                                totalRSVPs: parseInt(stats.total_rsvps) || 0,
                                confirmedRSVPs: parseInt(stats.confirmed_rsvps) || 0,
                                declinedRSVPs: parseInt(stats.declined_rsvps) || 0,
                                pendingRSVPs: parseInt(stats.pending_rsvps) || 0,
                            }];
                }
            });
        });
    };
    return RSVPModel;
}());
exports.RSVPModel = RSVPModel;
