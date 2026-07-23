import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

const mockStockFindAll = jest.fn();
const mockStockCreate = jest.fn();
const mockStockUpdate = jest.fn();
const mockStockDestroy = jest.fn();

jest.unstable_mockModule("../models/Stock.js", () => ({
  Stock: {
    findAll: mockStockFindAll,
    create: mockStockCreate,
    update: mockStockUpdate,
    destroy: mockStockDestroy,
  },
}));

const { getAllStock, createStock, updateStock, deleteStock } = await import(
  "../src/controllers/stockController.js"
);

function buildRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("stockController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================
     getAllStock
  ========================================================= */
  describe("getAllStock", () => {
    it("should return all stock items on success", async () => {
      const stockList = [
        { id: "stock-1", ingredient_name: "Kopi Arabica", amount: 100, unit: "gr" },
        { id: "stock-2", ingredient_name: "Susu", amount: 50, unit: "l" },
      ];
      mockStockFindAll.mockResolvedValue(stockList as any);

      const req = {} as Request;
      const res = buildRes();

      await getAllStock(req, res);

      expect(mockStockFindAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(stockList);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return an empty array when there is no stock", async () => {
      mockStockFindAll.mockResolvedValue([] as any);

      const req = {} as Request;
      const res = buildRes();

      await getAllStock(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return 500 if a database error occurs", async () => {
      mockStockFindAll.mockRejectedValue(new Error("Database connection failed"));

      const req = {} as Request;
      const res = buildRes();

      await getAllStock(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error fetching stock." })
      );
    });
  });

  /* =========================================================
     createStock
  ========================================================= */
  describe("createStock", () => {
    it("should create a new stock item with the provided fields", async () => {
      const newStock = {
        id: "stock-3",
        ingredient_name: "Gula",
        amount: 20,
        unit: "kg",
      };
      mockStockCreate.mockResolvedValue(newStock as any);

      const req = {
        body: { ingredient_name: "Gula", amount: 20, unit: "kg" },
      } as unknown as Request;
      const res = buildRes();

      await createStock(req, res);

      expect(mockStockCreate).toHaveBeenCalledWith({
        ingredient_name: "Gula",
        amount: 20,
        unit: "kg",
      });
      expect(res.json).toHaveBeenCalledWith(newStock);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should ignore extra fields not in the destructured payload", async () => {
      mockStockCreate.mockResolvedValue({ id: "stock-4" } as any);

      const req = {
        body: {
          ingredient_name: "Teh",
          amount: 15,
          unit: "kg",
          extraField: "should be dropped",
        },
      } as unknown as Request;
      const res = buildRes();

      await createStock(req, res);

      expect(mockStockCreate).toHaveBeenCalledWith({
        ingredient_name: "Teh",
        amount: 15,
        unit: "kg",
      });
    });

    it("should return 500 if a database error occurs", async () => {
      mockStockCreate.mockRejectedValue(new Error("Database connection failed"));

      const req = {
        body: { ingredient_name: "Gula", amount: 20, unit: "kg" },
      } as unknown as Request;
      const res = buildRes();

      await createStock(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error creating stock." })
      );
    });
  });

  /* =========================================================
     updateStock
  ========================================================= */
  describe("updateStock", () => {
    it("should update stock by id with the provided fields", async () => {
      mockStockUpdate.mockResolvedValue([1] as any);

      const req = {
        params: { id: "stock-1" },
        body: { ingredient_name: "Kopi Arabica", amount: 80, unit: "gr" },
      } as unknown as Request;
      const res = buildRes();

      await updateStock(req, res);

      expect(mockStockUpdate).toHaveBeenCalledWith(
        { ingredient_name: "Kopi Arabica", amount: 80, unit: "gr" },
        { where: { id: "stock-1" } }
      );
      expect(res.json).toHaveBeenCalledWith([1]);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return [0] affected rows when id does not match any stock", async () => {
      mockStockUpdate.mockResolvedValue([0] as any);

      const req = {
        params: { id: "nonexistent-id" },
        body: { ingredient_name: "Kopi Arabica", amount: 80, unit: "gr" },
      } as unknown as Request;
      const res = buildRes();

      await updateStock(req, res);

      expect(res.json).toHaveBeenCalledWith([0]);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return 500 if a database error occurs", async () => {
      mockStockUpdate.mockRejectedValue(new Error("Database connection failed"));

      const req = {
        params: { id: "stock-1" },
        body: { ingredient_name: "Kopi Arabica", amount: 80, unit: "gr" },
      } as unknown as Request;
      const res = buildRes();

      await updateStock(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error updating stock." })
      );
    });
  });

  /* =========================================================
     deleteStock
  ========================================================= */
  describe("deleteStock", () => {
    it("should delete stock by id and return the number of rows destroyed", async () => {
      mockStockDestroy.mockResolvedValue(1 as any);

      const req = { params: { id: "stock-1" } } as unknown as Request;
      const res = buildRes();

      await deleteStock(req, res);

      expect(mockStockDestroy).toHaveBeenCalledWith({ where: { id: "stock-1" } });
      expect(res.json).toHaveBeenCalledWith(1);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return 0 when id does not match any stock", async () => {
      mockStockDestroy.mockResolvedValue(0 as any);

      const req = { params: { id: "nonexistent-id" } } as unknown as Request;
      const res = buildRes();

      await deleteStock(req, res);

      expect(res.json).toHaveBeenCalledWith(0);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return 500 if a database error occurs", async () => {
      mockStockDestroy.mockRejectedValue(new Error("Database connection failed"));

      const req = { params: { id: "stock-1" } } as unknown as Request;
      const res = buildRes();

      await deleteStock(req, res);

      expect(mockStockDestroy).toHaveBeenCalledWith({ where: { id: "stock-1" } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error deleting stock." })
      );
    });
  });
});