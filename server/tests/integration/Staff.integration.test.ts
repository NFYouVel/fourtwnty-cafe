/**
 * tests/integration/staff.integration.test.ts
 * -----------------------------------------------------------------------
 * Integration test untuk fitur-fitur yang diakses oleh role "Staff":
 *  - Login
 *  - Melihat menu
 *  - Membuat order (dine-in)
 *  - Memproses pembayaran order
 *  - Otorisasi (Staff vs fitur khusus Manager)
 *  - End-to-end flow: create order -> lihat order process -> bayar order
 *
 * PENDEKATAN:
 *  - Menggunakan `jest.unstable_mockModule` untuk mock SEMUA model Sequelize
 *    (harus dipanggil SEBELUM import apapun yang menyentuh model tsb, sesuai
 *    aturan ESM mocking di Jest).
 *  - Route yang diuji adalah GlobalApi.ts yang SEBENARNYA (bukan tiruan),
 *    supaya hasil test merepresentasikan perilaku app yang sesungguhnya.
 *  - Menggunakan `supertest` untuk hit endpoint melalui instance Express asli.
 *
 * PRASYARAT:
 *  pnpm add -D supertest @types/supertest
 * -----------------------------------------------------------------------
 */

import { jest, describe, it, expect, beforeAll, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";
import express from "express";
import request from "supertest";
import bcrypt from "bcrypt";

// JWT_SECRET dibutuhkan oleh userController & authMiddleware.
// Proses test tidak menjalankan dotenv.config() (itu hanya dipanggil di server.ts),
// jadi kita set manual supaya sama dengan .env project.
process.env.JWT_SECRET = process.env.JWT_SECRET || "123456789";

/* =========================================================================
   1. MOCK SEMUA MODEL (WAJIB SEBELUM IMPORT CONTROLLER / ROUTES)
   ========================================================================= */

// ---- Users ----
const mockUsersFindOne = jest.fn();
const mockUsersFindAll = jest.fn();
const mockUsersCreate = jest.fn();
jest.unstable_mockModule("../../models/Users.js", () => ({
  Users: {
    findOne: mockUsersFindOne,
    findAll: mockUsersFindAll,
    create: mockUsersCreate,
  },
}));

// ---- Menu ----
const mockMenuFindAll = jest.fn();
jest.unstable_mockModule("../../models/Menu.js", () => ({
  Menu: { findAll: mockMenuFindAll },
}));

// ---- MenuIngredient ----
const mockMenuIngredientFindAll = jest.fn();
jest.unstable_mockModule("../../models/MenuIngredient.js", () => ({
  MenuIngredient: { findAll: mockMenuIngredientFindAll },
}));

// ---- Stock (dipakai hanya sebagai referensi `include: [{ model: Stock }]`,
//      tidak pernah benar-benar dieksekusi karena MenuIngredient di-mock) ----
jest.unstable_mockModule("../../models/Stock.js", () => ({
  Stock: {},
}));

// ---- Order ----
const mockOrderCreate = jest.fn();
const mockOrderFindAll = jest.fn();
const mockOrderUpdate = jest.fn();
jest.unstable_mockModule("../../models/Order.js", () => ({
  Order: {
    create: mockOrderCreate,
    findAll: mockOrderFindAll,
    update: mockOrderUpdate,
  },
}));

// ---- OrderMenu ----
jest.unstable_mockModule("../../models/OrderMenu.js", () => ({
  OrderMenu: {},
}));

// ---- TableInformation ----
const mockTableFindOne = jest.fn();
jest.unstable_mockModule("../../models/TableInformation.js", () => ({
  TableInformation: { findOne: mockTableFindOne },
}));

// ---- Payment ----
const mockPaymentFindOne = jest.fn();
jest.unstable_mockModule("../../models/Payment.js", () => ({
  Payment: { findOne: mockPaymentFindOne },
}));

// ---- Reservation (transitif, tidak dipakai langsung di test ini) ----
jest.unstable_mockModule("../../models/Reservation.js", () => ({
  Reservation: {},
}));

// ---- uuid ----
let uuidCounter = 0;
jest.unstable_mockModule("uuid", () => ({
  v4: () => `fixed-uuid-${++uuidCounter}`,
}));

/* =========================================================================
   2. IMPORT ROUTES SETELAH SEMUA MOCK TERPASANG
   ========================================================================= */

const { default: GlobalApi } = await import("../../src/routes/GlobalApi.js");

/* =========================================================================
   3. BUILD EXPRESS APP (sama seperti server.ts, tanpa app.listen & DB connect)
   ========================================================================= */

const app = express();
app.use(express.json());
app.use("/api", GlobalApi);

/* =========================================================================
   4. FIXTURES
   ========================================================================= */

const STAFF_PASSWORD_PLAIN = "staff123";
let staffPasswordHash: string;

const staffUserRecord = () => ({
  id: "staff-user-id-1",
  name: "Joko Staff",
  email: "joko.staff@cafe.com",
  password: staffPasswordHash,
  user_role: "Staff",
  getDataValue(key: string) {
    return (this as any)[key];
  },
});

let staffToken: string;

beforeAll(async () => {
  staffPasswordHash = await bcrypt.hash(STAFF_PASSWORD_PLAIN, 10);
});

beforeEach(() => {
  jest.clearAllMocks();
});

/* =========================================================================
   5. TEST SUITE
   ========================================================================= */

describe("Staff Integration Tests", () => {
  /* -----------------------------------------------------------------------
     TC_STAFF_001 - Login Staff berhasil
  ----------------------------------------------------------------------- */
  test('TC_STAFF_001: Staff berhasil login dan menerima token JWT', async () => {
    mockUsersFindOne.mockResolvedValue(staffUserRecord() as any);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "joko.staff@cafe.com",
        password: STAFF_PASSWORD_PLAIN,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login success");
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");

    staffToken = res.body.token;
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_002 - Login gagal, password salah
  ----------------------------------------------------------------------- */
  test('TC_STAFF_002: Login gagal karena password salah', async () => {
    mockUsersFindOne.mockResolvedValue(staffUserRecord() as any);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "joko.staff@cafe.com",
        password: "password-salah",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Wrong password");
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_003 - Login gagal, email tidak terdaftar
  ----------------------------------------------------------------------- */
  test('TC_STAFF_003: Login gagal karena email tidak ditemukan', async () => {
    mockUsersFindOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "tidakada@cafe.com",
        password: "apapun",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User with that email not found!");
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_004 - Staff berhasil melihat daftar menu
  ----------------------------------------------------------------------- */
  test('TC_STAFF_004: Staff berhasil mengambil daftar menu', async () => {
    // login dulu untuk mendapat token dummy (dipakai di header meskipun
    // route belum enforce authMiddleware, lihat catatan TC_STAFF_009/010)
    mockUsersFindOne.mockResolvedValue(staffUserRecord() as any);
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "joko.staff@cafe.com", password: STAFF_PASSWORD_PLAIN });
    const token = loginRes.body.token;

    const menuList = [
      { id: "menu-1", name: "Kopi Susu Gula Aren", price: 20000, category: "Drink" },
      { id: "menu-2", name: "Nasi Goreng", price: 25000, category: "Main" },
    ];
    mockMenuFindAll.mockResolvedValue(menuList as any);

    const res = await request(app)
      .get("/api/order/menu")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(menuList);
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_005 - Staff berhasil membuat order dine-in
  ----------------------------------------------------------------------- */
  test('TC_STAFF_005: Staff berhasil membuat order dine-in baru', async () => {
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-5", table_number: 5 });

    const stockUpdate = jest.fn().mockResolvedValue(undefined);
    const ingredientRow = {
      jumlah_pemakaian: 2,
      stock: {
        amount: 100,
        ingredient_name: "Susu",
        getDataValue: (key: string) => (key === "amount" ? 100 : undefined),
        update: stockUpdate,
      },
      toJSON: () => ({}),
    };
    mockMenuIngredientFindAll.mockResolvedValue([ingredientRow] as any);

    mockOrderCreate.mockResolvedValue({
      id: "order-uuid-1",
      status: "Process",
      total_price: 40000,
      payment: { id: "payment-uuid-1", status: "Unpaid" },
    } as any);

    const res = await request(app)
      .post("/api/order/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send([
        {
          tableId: 5,
          menuId: "menu-1",
          quantity: 2,
          price: 20000,
          userId: "staff-user-id-1",
        },
      ]);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total_price).toBe(40000);
    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({ total_price: 40000, status: "Process" }),
      expect.anything()
    );
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_006 - Staff gagal membuat order, nomor meja tidak ditemukan
  ----------------------------------------------------------------------- */
  test('TC_STAFF_006: Gagal membuat order karena nomor meja tidak ditemukan', async () => {
    mockTableFindOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/order/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send([{ tableId: 99, menuId: "menu-1", quantity: 1, price: 20000, userId: "staff-user-id-1" }]);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Nomor meja tidak ditemukan di sistem");
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_007 - Staff gagal membuat order, stok tidak cukup
  ----------------------------------------------------------------------- */
  test('TC_STAFF_007: Gagal membuat order karena stok bahan tidak cukup', async () => {
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-5", table_number: 5 });
    mockMenuIngredientFindAll.mockResolvedValue([
      {
        jumlah_pemakaian: 50,
        stock: { amount: 10, ingredient_name: "Kopi Arabica", update: jest.fn() },
        toJSON: () => ({}),
      },
    ] as any);

    const res = await request(app)
      .post("/api/order/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send([{ tableId: 5, menuId: "menu-1", quantity: 1, price: 20000, userId: "staff-user-id-1" }]);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Stock Kopi Arabica tidak cukup");
    expect(mockOrderCreate).not.toHaveBeenCalled();
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_008 - Staff berhasil memproses pembayaran order
  ----------------------------------------------------------------------- */
  test('TC_STAFF_008: Staff berhasil memproses pembayaran (PayOrder)', async () => {
    const paymentInstance: any = {
      id: "payment-uuid-9",
      orderId: "order-uuid-9",
      status: "Unpaid",
      method: null,
    };
    paymentInstance.update = jest.fn().mockImplementation(async (data: any) => {
      Object.assign(paymentInstance, data);
      return paymentInstance;
    });
    mockPaymentFindOne.mockResolvedValue(paymentInstance);
    mockOrderUpdate.mockResolvedValue([1]);

    const res = await request(app)
      .put("/api/order/pay/order-uuid-9")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send({ method: "Cash" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("Paid");
    expect(res.body.data.method).toBe("Cash");
    expect(mockOrderUpdate).toHaveBeenCalledWith(
      { status: "Closed" },
      { where: { id: "order-uuid-9" } }
    );
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_009 (NEGATIVE) - Pembayaran gagal, data payment tidak ditemukan
  ----------------------------------------------------------------------- */
  test('TC_STAFF_009: Gagal memproses pembayaran karena data payment tidak ditemukan', async () => {
    mockPaymentFindOne.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/order/pay/order-tidak-ada")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send({ method: "Cash" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Data pembayaran tidak ditemukan");
  });
  
  /* -----------------------------------------------------------------------
     TC_STAFF_010 (OTORISASI/BUG) - Staff mengakses create-staff milik Manager
  ----------------------------------------------------------------------- */
  test('TC_STAFF_010 [OTORISASI/BUG]: Staff SAAT INI masih bisa mengakses endpoint create-staff milik Manager', async () => {
    mockUsersCreate.mockResolvedValue({
      id: "new-staff-id",
      name: "Staff Baru",
      email: "staffbaru@cafe.com",
      user_role: "Staff",
    } as any);

    const res = await request(app)
      .post("/api/staff/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send({
        name: "Staff Baru",
        email: "staffbaru@cafe.com",
        password: "123456",
        phone: "08123456789",
      });

    // Perilaku IDEAL (setelah bug diperbaiki) seharusnya 403.
    // Perilaku AKTUAL saat ini adalah 200 -> didokumentasikan sebagai BUG.
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_011 (OTORISASI) - Staff mengakses fitur report (Manager only)
  ----------------------------------------------------------------------- */
  test('TC_STAFF_011 [OTORISASI/BUG]: Staff SAAT INI masih bisa mengakses endpoint sales report milik Manager', async () => {
    mockOrderFindAll.mockResolvedValue([] as any);

    const res = await request(app)
      .get("/api/report")
      .query({ start: "2026-01-01", end: "2026-01-31" })
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`);

    // Idealnya 403 (lihat BUG_REPORT.md BR-001). Aktual saat ini 200.
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalRevenue");
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_012 (INTEGRATION / END-TO-END) - Flow lengkap Staff
  ----------------------------------------------------------------------- */
  test('TC_STAFF_012 [INTEGRATION]: Flow end-to-end order + payment oleh Staff', async () => {
    // ---------- STEP 1: create order ----------
    mockTableFindOne.mockResolvedValue({ id: "table-uuid-7", table_number: 7 });

    const stockUpdate = jest.fn().mockResolvedValue(undefined);
    const ingredientRow = {
      jumlah_pemakaian: 1,
      stock: {
        amount: 50,
        ingredient_name: "Gula Aren",
        getDataValue: (key: string) => (key === "amount" ? 50 : undefined),
        update: stockUpdate,
      },
      toJSON: () => ({}),
    };
    mockMenuIngredientFindAll.mockResolvedValue([ingredientRow] as any);

    const createdOrder = {
      id: "order-e2e-1",
      status: "Process",
      total_price: 20000,
      payment: { id: "payment-e2e-1", status: "Unpaid" },
    };
    mockOrderCreate.mockResolvedValue(createdOrder as any);

    const createRes = await request(app)
      .post("/api/order/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send([{ tableId: 7, menuId: "menu-1", quantity: 1, price: 20000, userId: "staff-user-id-1" }]);

    expect(createRes.status).toBe(201);
    const orderId = createRes.body.data.id;
    expect(orderId).toBe("order-e2e-1");

    // ---------- STEP 2: lihat daftar order yang masih "Process" ----------
    mockOrderFindAll.mockResolvedValue([
      {
        id: orderId,
        order_type: "Dine-in",
        status: "Process",
        total_price: 20000,
      },
    ] as any);

    const listRes = await request(app)
      .get("/api/order/process")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(orderId);

    // ---------- STEP 3: bayar order tersebut ----------
    const paymentInstance: any = {
      id: "payment-e2e-1",
      orderId,
      status: "Unpaid",
      method: null,
    };
    paymentInstance.update = jest.fn().mockImplementation(async (data: any) => {
      Object.assign(paymentInstance, data);
      return paymentInstance;
    });
    mockPaymentFindOne.mockResolvedValue(paymentInstance);
    mockOrderUpdate.mockResolvedValue([1]);

    const payRes = await request(app)
      .put(`/api/order/pay/${orderId}`)
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send({ method: "QRIS" });

    expect(payRes.status).toBe(200);
    expect(payRes.body.success).toBe(true);
    expect(payRes.body.data.status).toBe("Paid");
    expect(payRes.body.data.method).toBe("QRIS");

    // ---------- VERIFIKASI: Order di-update ke status "Closed" ----------
    expect(mockOrderUpdate).toHaveBeenCalledWith(
      { status: "Closed" },
      { where: { id: orderId } }
    );
  });

  /* -----------------------------------------------------------------------
     TC_STAFF_013 (NEGATIVE) - Server error saat membuat order (500)
  ----------------------------------------------------------------------- */
  test('TC_STAFF_013: Mengembalikan 500 jika terjadi database error saat create order', async () => {
    mockTableFindOne.mockRejectedValue(new Error("Database connection failed"));

    const res = await request(app)
      .post("/api/order/create")
      .set("Authorization", `Bearer ${staffToken ?? "dummy-token"}`)
      .send([{ tableId: 5, menuId: "menu-1", quantity: 1, price: 20000, userId: "staff-user-id-1" }]);

    expect(res.status).toBe(500);
    expect(res.body.message).toContain("Database connection failed");
    expect(mockOrderCreate).not.toHaveBeenCalled();
  });
});