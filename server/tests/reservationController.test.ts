import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

// ---- Mock semua model yang digunakan di reservationController ----
const mockTableFindOne = jest.fn();
const mockReservationFindAll = jest.fn();
const mockReservationFindByPk = jest.fn();
const mockReservationFindOne = jest.fn();
const mockReservationCreate = jest.fn();

jest.unstable_mockModule("../models/TableInformation.js", () => ({
  TableInformation: { findOne: mockTableFindOne },
}));

jest.unstable_mockModule("../models/Reservation.js", () => ({
  Reservation: {
    findAll: mockReservationFindAll,
    findByPk: mockReservationFindByPk,
    findOne: mockReservationFindOne,
    create: mockReservationCreate,
  },
}));

jest.unstable_mockModule("../models/Users.js", () => ({ Users: {} }));

// Mock uuid
jest.unstable_mockModule("uuid", () => ({
  v4: () => "fixed-uuid",
}));

// Import controller SETELAH semua mock
const {
  getAllReservation,
  createReservation,
  staffUpdateReservationStatus,
  requestReschedule,
  getUserReservations,
} = await import("../src/controllers/reservationController.js");

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

describe("reservationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* =========================================================
     getAllReservation
  ========================================================= */
  describe("getAllReservation", () => {
    it("should return the list of reservations on success", async () => {
      const reservations = [
        { id: "res-1", tanggal_reservation: "2026-08-01" },
        { id: "res-2", tanggal_reservation: "2026-08-05" },
      ];
      mockReservationFindAll.mockResolvedValue(reservations as any);

      const req = {} as Request;
      const res = buildRes();

      await getAllReservation(req, res);

      expect(mockReservationFindAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(reservations);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it("should return 500 if a database error occurs", async () => {
      mockReservationFindAll.mockRejectedValue(new Error("Database connection failed"));

      const req = {} as Request;
      const res = buildRes();

      await getAllReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Get All Reservation error",
          detail: "Database connection failed",
        })
      );
    });
  });

  /* =========================================================
     createReservation
  ========================================================= */
  describe("createReservation", () => {
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

    it("should return 500 if a database error occurs while creating", async () => {
      mockTableFindOne.mockResolvedValue({ id: "table-uuid-1", table_number: 5 });
      mockReservationCreate.mockRejectedValue(new Error("Database connection failed"));

      const req = buildReq({
        tanggal_reservation: "2026-08-01",
        jumlah_orang: 4,
        table_number: 5,
      });
      const res = buildRes();

      await createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Gagal Create Reservation",
          detail: "Database connection failed",
        })
      );
    });
  });

  /* =========================================================
     staffUpdateReservationStatus
  ========================================================= */
  describe("staffUpdateReservationStatus", () => {
    function buildParamsReq(id: string, status_reservation: string): Request {
      return {
        params: { id },
        body: { status_reservation },
      } as unknown as Request;
    }

    it("should return 500 if reservation is not found", async () => {
      mockReservationFindByPk.mockResolvedValue(null);

      const req = buildParamsReq("res-uuid-1", "Approved");
      const res = buildRes();

      await staffUpdateReservationStatus(req, res);

      expect(mockReservationFindByPk).toHaveBeenCalledWith("res-uuid-1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Data reservation tidak di temukan",
        })
      );
    });

    it("should update reservation status successfully", async () => {
      const reservationUpdate = jest.fn().mockResolvedValue(undefined);
      const reservationRecord = {
        id: "res-uuid-1",
        status_reservation: "Pending",
        update: reservationUpdate,
      };

      mockReservationFindByPk.mockResolvedValue(reservationRecord as any);

      const req = buildParamsReq("res-uuid-1", "Approved");
      const res = buildRes();

      await staffUpdateReservationStatus(req, res);

      expect(reservationUpdate).toHaveBeenCalledWith({
        status_reservation: "Approved",
      });
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Update reservation status",
          data: reservationRecord,
        })
      );
    });

    it("should return 500 if a database error occurs", async () => {
      mockReservationFindByPk.mockRejectedValue(new Error("Database connection failed"));

      const req = buildParamsReq("res-uuid-1", "Approved");
      const res = buildRes();

      await staffUpdateReservationStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Gagal Approve Reservation",
          detail: "Database connection failed",
        })
      );
    });
  });

  /* =========================================================
     requestReschedule
  ========================================================= */
  describe("requestReschedule", () => {
    function buildRescheduleReq(id: string, body: any, userId = "user-1"): Request {
      return {
        params: { id },
        body,
        user: { id: userId },
      } as unknown as Request;
    }

    it("should return 500 if reservation is not found for the user", async () => {
      mockReservationFindOne.mockResolvedValue(null);

      const req = buildRescheduleReq("res-uuid-1", { tanggal_reschedule: "2026-09-01" });
      const res = buildRes();

      await requestReschedule(req, res);

      expect(mockReservationFindOne).toHaveBeenCalledWith({
        where: { id: "res-uuid-1", userId: "user-1" },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Reservasi tidak terdaftar",
        })
      );
    });

    it("should update reservation with new date and 'Reschedule' status on success", async () => {
      const reservationUpdate = jest.fn().mockResolvedValue(undefined);
      const reservationRecord = {
        id: "res-uuid-1",
        userId: "user-1",
        tanggal_reservation: "2026-08-01",
        update: reservationUpdate,
      };

      mockReservationFindOne.mockResolvedValue(reservationRecord as any);

      const req = buildRescheduleReq("res-uuid-1", { tanggal_reschedule: "2026-09-01" });
      const res = buildRes();

      await requestReschedule(req, res);

      expect(reservationUpdate).toHaveBeenCalledWith({
        tanggal_reschedule: "2026-09-01",
        status: "Reschedule",
      });
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "Success",
          message: "Request tanggal reschedule",
          data: reservationRecord,
        })
      );
    });

    it("should return 500 if a database error occurs", async () => {
      mockReservationFindOne.mockRejectedValue(new Error("Database connection failed"));

      const req = buildRescheduleReq("res-uuid-1", { tanggal_reschedule: "2026-09-01" });
      const res = buildRes();

      await requestReschedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Gagal Reschedule ",
          detail: "Database connection failed",
        })
      );
    });
  });

  /* =========================================================
     getUserReservations
  ========================================================= */
  describe("getUserReservations", () => {
    it("should return the user's reservations on success", async () => {
      const reservations = [
        { id: "res-1", userId: "user-1", tanggal_reservation: "2026-08-01" },
      ];
      mockReservationFindAll.mockResolvedValue(reservations as any);

      const req = { params: { id: "user-1" } } as unknown as Request;
      const res = buildRes();

      await getUserReservations(req, res);

      expect(mockReservationFindAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1" },
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "Success",
          data: reservations,
        })
      );
    });

    it("should return 500 if a database error occurs", async () => {
      mockReservationFindAll.mockRejectedValue(new Error("Database connection failed"));

      const req = { params: { id: "user-1" } } as unknown as Request;
      const res = buildRes();

      await getUserReservations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Gagal Memuat Reservation ",
          detail: "Database connection failed",
        })
      );
    });
  });
});