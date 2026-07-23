import { jest } from "@jest/globals";
import type { Request, Response } from "express";

// ---- Mock semua model yang digunakan langsung di createReservation ----
const mockTableFindOne = jest.fn();
const mockReservationCreate = jest.fn();

jest.unstable_mockModule("../models/TableInformation.js", () => ({
  TableInformation: { findOne: mockTableFindOne },
}));

jest.unstable_mockModule("../models/Reservation.js", () => ({
  Reservation: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: mockReservationCreate,
  },
}));

jest.unstable_mockModule("../models/Users.js", () => ({ Users: {} }));

// Mock uuid
jest.unstable_mockModule("uuid", () => ({
  v4: () => "fixed-uuid",
}));

// Import controller SETELAH semua mock
const { createReservation } = await import("../src/controllers/reservationController.js");

function buildRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

function buildReq(body: any, userId = "user-1"): Request {
  return {
    body,
    user: { id: userId },
  } as unknown as Request;
}

describe("createReservation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 500 if required fields are missing", async () => {
    const req = buildReq({
      jumlah_orang: 4,
      table_number: 5,
      // tanggal_reservation missing
    });
    const res = buildRes();

    await createReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "Fail",
        message: "Data tidak boleh kosong",
      })
    );
    expect(mockTableFindOne).not.toHaveBeenCalled();
    expect(mockReservationCreate).not.toHaveBeenCalled();
  });

  it("should return 404 if table number is not found", async () => {
    mockTableFindOne.mockResolvedValue(null);

    const req = buildReq({
      tanggal_reservation: "2026-08-01",
      jumlah_orang: 2,
      table_number: 99,
    });
    const res = buildRes();

    await createReservation(req, res);

    expect(mockTableFindOne).toHaveBeenCalledWith({
      where: { table_number: 99 },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "Fail",
        message: "Meja nomor #99 tidak di temukan",
      })
    );
    expect(mockReservationCreate).not.toHaveBeenCalled();
  });

  it("should create reservation successfully when table exists and data is valid", async () => {
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-1", table_number: 5 });

    const createdReservation = {
      id: "fixed-uuid",
      userId: "user-1",
      tanggal_reservation: "2026-08-01",
      jumlah_orang: 4,
      tableId: "table-uuid-1",
      status_reservation: "Pending",
    };
    mockReservationCreate.mockResolvedValue(createdReservation as any);

    const req = buildReq({
      tanggal_reservation: "2026-08-01",
      jumlah_orang: 4,
      table_number: 5,
    });
    const res = buildRes();

    await createReservation(req, res);

    expect(mockReservationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "fixed-uuid",
        userId: "user-1",
        tanggal_reservation: "2026-08-01",
        jumlah_orang: 4,
        tableId: "table-uuid-1",
        status_reservation: "Pending",
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "Success",
        message: "Berhasil Create Reservation",
        data: createdReservation,
      })
    );
  });
});