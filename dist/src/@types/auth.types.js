"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
var Role;
(function (Role) {
    Role["OWNER"] = "owner";
    Role["COLLABORATOR"] = "collaborator";
    Role["VIEWER"] = "viewer";
})(Role || (exports.Role = Role = {}));
// export interface AuthRequest extends Request {
//     user?: {
//         id: string;
//         role: string;
//     };
// }
