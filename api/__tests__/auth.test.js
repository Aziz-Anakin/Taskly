import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { auth } from "../auth.js";

process.env.SECRET = "test_secret";

// Petit faux objet `res` qui capture le statut et le corps JSON.
function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("middleware auth", () => {
  test("renvoie 401 quand l'en-tête Authorization est absent", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("renvoie 401 quand le token est manquant après 'Bearer'", () => {
    const req = { headers: { authorization: "Bearer " } };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("renvoie 403 quand le token est invalide", () => {
    const req = { headers: { authorization: "Bearer un.token.bidon" } };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("appelle next() et remplit req.user quand le token est valide", () => {
    const token = jwt.sign(
      { id: "507f1f77bcf86cd799439011", email: "demo@taskly.fr" },
      process.env.SECRET
    );
    const req = { headers: { authorization: "Bearer " + token } };
    const res = mockRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBeNull();
    expect(req.user.id).toBe("507f1f77bcf86cd799439011");
    expect(req.user.email).toBe("demo@taskly.fr");
  });
});
