import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

// ---- Mock semua model yang digunakan langsung di createOrder ----
const mockTableFindOne = jest.fn();
const mockMenuIngredientFindAll = jest.fn();
const mockOrderCreate = jest.fn();

jest.unstable_mockModule("../models/TableInformation.js", () => ({
  TableInformation: { findOne: mockTableFindOne },
}));

jest.unstable_mockModule("../models/MenuIngredient.js", () => ({
  MenuIngredient: { findAll: mockMenuIngredientFindAll },
}));

jest.unstable_mockModule("../models/Order.js", () => ({
  Order: { create: mockOrderCreate },
}));

// Mock model lain yang mungkin diimpor secara transitif (dari relasi)
jest.unstable_mockModule("../models/Menu.js", () => ({ Menu: {} }));
jest.unstable_mockModule("../models/OrderMenu.js", () => ({ OrderMenu: {} }));
jest.unstable_mockModule("../models/Payment.js", () => ({ Payment: {} }));
jest.unstable_mockModule("../models/Stock.js", () => ({ Stock: {} }));

// Mock untuk model yang menyebabkan error sebelumnya
jest.unstable_mockModule("../models/Users.js", () => ({ Users: {} }));
jest.unstable_mockModule("../models/Reservation.js", () => ({ Reservation: {} }));

// Mock uuid
jest.unstable_mockModule("uuid", () => ({
  v4: () => "fixed-uuid",
}));

// Import controller SETELAH semua mock
const { createOrder } = await import("../src/controllers/orderController.js");

function buildRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("createOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if table number not found", async () => {
    mockTableFindOne.mockResolvedValue(null);

    const req = {
      body: [{ tableId: 99, menuId: "menu-1", quantity: 1, price: 20000, userId: "user-1" }],
    } as unknown as Request;
    const res = buildRes();

    await createOrder(req, res);

    expect(mockTableFindOne).toHaveBeenCalledWith({
      where: { table_number: 99 },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Nomor meja tidak ditemukan di sistem",
      })
    );
    expect(mockMenuIngredientFindAll).not.toHaveBeenCalled();
  });

  it("should return 400 if ingredient stock is insufficient", async () => {
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-1", table_number: 5 });

    mockMenuIngredientFindAll.mockResolvedValue([
      {
        jumlah_pemakaian: 50,
        stock: { amount: 30, ingredient_name: "Kopi Arabica", update: jest.fn() },
        toJSON: () => ({}),
      },
    ] as any);

    const req = {
      body: [{ tableId: 5, menuId: "menu-1", quantity: 1, price: 20000, userId: "user-1" }],
    } as unknown as Request;
    const res = buildRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Stock Kopi Arabica tidak cukup",
      })
    );
    expect(mockOrderCreate).not.toHaveBeenCalled();
  });

  it("should create order successfully, reduce stock, and calculate total correctly", async () => {
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-1", table_number: 5 });

    const stockUpdate = jest.fn().mockResolvedValue(undefined);
    const stockRow = {
      jumlah_pemakaian: 2,
      stock: {
        amount: 100,
        getDataValue: (key: string) => (key === "amount" ? 100 : undefined),
        update: stockUpdate,
        ingredient_name: "Susu",
      },
      toJSON: () => ({}),
    };

    mockMenuIngredientFindAll.mockResolvedValue([stockRow] as any);
    mockOrderCreate.mockResolvedValue({ id: "order-uuid-1", total_price: 40000 } as any);

    const req = {
      body: [
        { tableId: 5, menuId: "menu-1", quantity: 2, price: 20000, userId: "user-1" },
      ],
    } as unknown as Request;
    const res = buildRes();

    await createOrder(req, res);

    expect(stockUpdate).toHaveBeenCalledWith({ amount: 96 });
    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        total_price: 40000,
        order_type: "Dine-in",
        status: "Process",
        tableId: "table-uuid-1",
      }),
      expect.anything()
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("should return 500 if database error occurs", async () => {
    mockTableFindOne.mockRejectedValue(new Error("Database connection failed"));

    const req = {
      body: [{ tableId: 5, menuId: "menu-1", quantity: 1, price: 20000, userId: "user-1" }],
    } as unknown as Request;
    const res = buildRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Database connection failed"),
      })
    );
    expect(mockOrderCreate).not.toHaveBeenCalled();
  });
});