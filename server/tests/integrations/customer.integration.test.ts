// ============================================================
// 1. MOCK SEMUA MODUL (SEBELUM IMPORT)
// ============================================================
import { jest } from '@jest/globals';

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockImplementation((pwd) => Promise.resolve('hashed_' + pwd)),
    compare: jest.fn().mockImplementation((_pwd, _hash) => Promise.resolve(true)),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('dummy-token'),
    verify: jest.fn().mockReturnValue({ id: 'dummy-id', role: 'Customer' }),
}));

// ============================================================
// 2. IMPORT MODUL (SESUAI URUTAN MANAGER TEST)
// ============================================================
import request from 'supertest';
import app from '../../src/server.js';
import { sequelize } from '../../src/config/database.js';
import jwt from 'jsonwebtoken';
import { Users } from '../../models/Users.js';
import bcrypt from 'bcrypt';
import { Menu } from '../../models/Menu.js';
import { Stock } from '../../models/Stock.js';         // ← WAJIB diimpor (seperti manager test)
import { TableInformation } from '../../models/TableInformation.js';
import { Order } from '../../models/Order.js';
import { Reservation } from '../../models/Reservation.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// 3. DUMMY TEST
// ============================================================
test('Dummy test - Jest is working', () => {
    expect(true).toBe(true);
});

// ============================================================
// 4. TEST SUITE (CUSTOMER ROLE)
// ============================================================
describe('CUSTOMER ROLE – Full Integration Tests', () => {
    let customerToken: string;
    let customerId: string;
    let createdReservationId: string;
    let dummyMenuId: string;
    let dummyTableId: string;
    let dummyReservationId: string;

    // ─── SEBELUM SEMUA TEST: BERSIHKAN DATA & BUAT CUSTOMER ───
    beforeAll(async () => {
        await Users.destroy({ where: { email: ['customer@cafe.com'] }, force: true });
        await Menu.destroy({ where: { name: 'Test Menu Customer' }, force: true });
        await TableInformation.destroy({ where: { table_number: 100 }, force: true });
        await Reservation.destroy({ where: { userId: customerId } }); // aman

        customerId = uuidv4();
        const hashedPassword = await bcrypt.hash('customer123', 10);
        await Users.create({
            id: customerId,
            name: 'Customer',
            email: 'customer@cafe.com',
            password: hashedPassword,
            phone: '08123456789',
            user_role: 'Customer'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'customer@cafe.com', password: 'customer123' });

        if (loginRes.status === 200 && loginRes.body.token) {
            customerToken = loginRes.body.token;
        } else {
            const secret = process.env.JWT_SECRET || 'dummysecret';
            customerToken = jwt.sign(
                { id: customerId, email: 'customer@cafe.com', role: 'Customer' },
                secret,
                { expiresIn: '1d' }
            );
            console.warn('⚠️ Using dummy token for customer (login failed)');
        }
        expect(customerToken).toBeDefined();

        // Seed data
        const menuId = uuidv4();
        await Menu.create({
            id: menuId,
            name: 'Test Menu Customer',
            price: 20000,
            category: 'Food',
            description: 'For testing customer access'
        });
        dummyMenuId = menuId;

        const tableId = uuidv4();
        await TableInformation.create({
            id: tableId,
            table_number: 100,
            seat_count: 2,
            area: 'Indoor',
            status: 'Available'
        });
        dummyTableId = tableId;

        const resvId = uuidv4();
        await Reservation.create({
            id: resvId,
            tanggal_reservation: new Date(),
            jumlah_orang: 2,
            userId: customerId,
            tableId: dummyTableId,
            status_reservation: 'Pending'
        });
        dummyReservationId = resvId;
    });

    afterAll(async () => {
        await Users.destroy({ where: { email: ['customer@cafe.com'] }, force: true });
        await Menu.destroy({ where: { id: dummyMenuId }, force: true });
        await TableInformation.destroy({ where: { id: dummyTableId }, force: true });
        await Reservation.destroy({ where: { id: dummyReservationId }, force: true });
        if (createdReservationId) {
            await Reservation.destroy({ where: { id: createdReservationId }, force: true });
        }
        await sequelize.close();
    });

    test('TC_DUMMY: Test suite is running', () => {
        expect(customerToken).toBeDefined();
    });

    // ─── POSITIVE TEST CASES ──────────────────────────────────────────

    test('TC_CUST_001: Customer berhasil login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'customer@cafe.com', password: 'customer123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('user_role', 'Customer');
    });

    test('TC_CUST_002: Customer dapat melihat semua menu (GET /api/menu/all)', async () => {
        const res = await request(app)
            .get('/api/menu/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const menus = res.body as any[];
        expect(menus.some(m => m.id === dummyMenuId)).toBe(true);
    });

    test('TC_CUST_003: Customer dapat melihat menu berdasarkan ID (GET /api/menu/:id)', async () => {
        const res = await request(app)
            .get(`/api/menu/${dummyMenuId}`)
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(dummyMenuId);
        expect(res.body.name).toBe('Test Menu Customer');
    });

    test('TC_CUST_004: Customer dapat melihat semua meja (GET /api/tableInformation/all)', async () => {
        const res = await request(app)
            .get('/api/tableInformation/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const tables = res.body as any[];
        expect(tables.some(t => t.id === dummyTableId)).toBe(true);
    });

    test('TC_CUST_005: Customer dapat melihat meja berdasarkan ID (GET /api/tableInformation/:id)', async () => {
        const res = await request(app)
            .get(`/api/tableInformation/${dummyTableId}`)
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Success');
        expect(res.body.data.id).toBe(dummyTableId);
    });

    test('TC_CUST_006: Customer dapat cek ketersediaan meja dengan tanggal (GET /api/tableInformation/availability)', async () => {
        const tanggal = new Date().toISOString().split('T')[0];
        const res = await request(app)
            .get(`/api/tableInformation/availability?tanggal=${tanggal}`)
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((item: any) => {
            expect(item).toHaveProperty('is_booked');
            expect(typeof item.is_booked).toBe('boolean');
        });
    });

    test('TC_CUST_007: Customer berhasil membuat reservasi (POST /api/reservation/create)', async () => {
        const res = await request(app)
            .post('/api/reservation/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                tanggal_reservation: new Date(),
                jumlah_orang: 4,
                userId: customerId,
                tableId: dummyTableId
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        createdReservationId = res.body.data.id;
    });

    test('TC_CUST_008: Customer dapat melihat semua reservasi (GET /api/reservation/all)', async () => {
        const res = await request(app)
            .get('/api/reservation/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        const reservations = res.body as any[];
        expect(reservations.some(r => r.id === dummyReservationId)).toBe(true);
    });

    test('TC_CUST_008A: Customer dapat melihat reservasi berdasarkan ID (GET /api/reservation/:id)', async () => {
        const res = await request(app)
            .get(`/api/reservation/${dummyReservationId}`)
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(dummyReservationId);
        expect(res.body.data.userId).toBe(customerId);
    });

    // ─── NEGATIVE TEST CASES (OTORISASI & VALIDASI) ──────────────────

    test('TC_CUST_009: Customer gagal membuat reservasi tanpa tanggal_reservation', async () => {
        const res = await request(app)
            .post('/api/reservation/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                jumlah_orang: 4,
                userId: customerId,
                tableId: dummyTableId
            });
        expect(res.status).toBe(400);
        if (res.status !== 400) {
            console.warn('⚠️ Expected 400, got', res.status);
        }
    });

    test('TC_CUST_010: Customer TIDAK BISA membuat menu (POST /api/menu/create) -> 403', async () => {
        const res = await request(app)
            .post('/api/menu/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ name: 'Forbidden Menu', price: 10000, category: 'Drink' });
        expect(res.status).toBe(403);
    });

    test('TC_CUST_011: Customer TIDAK BISA mengupdate stock (PUT /api/stock/update/:id) -> 403', async () => {
        const dummyStockId = uuidv4();
        const res = await request(app)
            .put(`/api/stock/update/${dummyStockId}`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ amount: 50 });
        expect(res.status).toBe(403);
    });

    test('TC_CUST_012: Customer TIDAK BISA mengakses daftar staff (GET /api/staff/all) -> 403', async () => {
        const res = await request(app)
            .get('/api/staff/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(403);
    });

    test('TC_CUST_013: Customer TIDAK BISA membuat order (POST /api/order/create) -> 403', async () => {
        const res = await request(app)
            .post('/api/order/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                order_type: 'Dine-in',
                status: 'Pending',
                total_price: 50000,
                userId: customerId,
                tableId: dummyTableId
            });
        expect(res.status).toBe(403);
    });

    test('TC_CUST_014: Customer TIDAK BISA membuat pembayaran (POST /api/payment/create) -> 403', async () => {
        const res = await request(app)
            .post('/api/payment/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                orderId: 'dummy-order-id',
                amount: 50000,
                method: 'Cash'
            });
        expect(res.status).toBe(403);
    });

    test('TC_CUST_015: Customer TIDAK BISA mengakses laporan penjualan (GET /api/report/sales) -> 403', async () => {
        const res = await request(app)
            .get('/api/report/sales')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(403);
    });

    test('TC_CUST_016: Customer TIDAK BISA update reservasi (PUT /api/reservation/:id) -> 403', async () => {
        const res = await request(app)
            .put(`/api/reservation/${dummyReservationId}`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ status_reservation: 'Approved' });
        expect(res.status).toBe(403);
    });

    test('TC_CUST_017: Customer TIDAK BISA delete reservasi (DELETE /api/reservation/:id) -> 403', async () => {
        const res = await request(app)
            .delete(`/api/reservation/${dummyReservationId}`)
            .set('Authorization', `Bearer ${customerToken}`);
        expect(res.status).toBe(403);
    });

    // ─── INTEGRATION TEST: END-TO-END ───
    test('TC_CUST_018: Integration test – Customer flow (login, lihat menu, lihat meja, buat reservasi, lalu coba order & payment gagal)', async () => {
        expect(customerToken).toBeDefined();

        const menuRes = await request(app)
            .get('/api/menu/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(menuRes.status).toBe(200);
        expect(menuRes.body.length).toBeGreaterThan(0);

        const tableRes = await request(app)
            .get('/api/tableInformation/all')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(tableRes.status).toBe(200);
        expect(tableRes.body.length).toBeGreaterThan(0);

        const reservasiRes = await request(app)
            .post('/api/reservation/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                tanggal_reservation: new Date(),
                jumlah_orang: 2,
                userId: customerId,
                tableId: dummyTableId
            });
        expect(reservasiRes.status).toBe(200);
        expect(reservasiRes.body.success).toBe(true);
        const newReservationId = reservasiRes.body.data.id;

        const orderRes = await request(app)
            .post('/api/order/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                order_type: 'Dine-in',
                status: 'Pending',
                total_price: 30000,
                userId: customerId,
                tableId: dummyTableId
            });
        expect(orderRes.status).toBe(403);

        const paymentRes = await request(app)
            .post('/api/payment/create')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                orderId: 'some-order-id',
                amount: 30000,
                method: 'Cash'
            });
        expect(paymentRes.status).toBe(403);

        await Reservation.destroy({ where: { id: newReservationId }, force: true });
    });
});

// ============================================================
// 5. TEST CASE DOCUMENT (TABEL)
// ============================================================
/*
| Test Case ID | Deskripsi | Input | Expected Output |
|--------------|-----------|-------|-----------------|
| TC_CUST_001  | Customer login berhasil | email: customer@cafe.com, password: customer123 | status 200, token terima, role Customer |
| TC_CUST_002  | Customer dapat melihat semua menu | GET /api/menu/all dengan token | status 200, array menu, contains dummy menu |
| TC_CUST_003  | Customer dapat melihat menu by ID | GET /api/menu/:dummyMenuId | status 200, data menu sesuai |
| TC_CUST_004  | Customer dapat melihat semua meja | GET /api/tableInformation/all | status 200, array meja, contains dummy table |
| TC_CUST_005  | Customer dapat melihat meja by ID | GET /api/tableInformation/:dummyTableId | status 200, data meja sesuai |
| TC_CUST_006  | Customer cek ketersediaan meja dengan tanggal | GET /api/tableInformation/availability?tanggal=... | status 200, array dengan properti is_booked |
| TC_CUST_007  | Customer berhasil membuat reservasi | POST /api/reservation/create dengan data valid | status 200, success true, data id |
| TC_CUST_008  | Customer dapat melihat semua reservasi | GET /api/reservation/all | status 200, array reservasi, contains dummy |
| TC_CUST_008A | Customer dapat melihat reservasi by ID | GET /api/reservation/:dummyReservationId | status 200, data reservasi sesuai userId |
| TC_CUST_009  | Customer gagal membuat reservasi tanpa tanggal | POST /api/reservation/create tanpa tanggal_reservation | status 400 (atau error) |
| TC_CUST_010  | Customer tidak bisa membuat menu | POST /api/menu/create | status 403 (Forbidden) |
| TC_CUST_011  | Customer tidak bisa update stock | PUT /api/stock/update/:id | status 403 |
| TC_CUST_012  | Customer tidak bisa akses staff | GET /api/staff/all | status 403 |
| TC_CUST_013  | Customer tidak bisa membuat order | POST /api/order/create | status 403 |
| TC_CUST_014  | Customer tidak bisa membuat payment | POST /api/payment/create | status 403 |
| TC_CUST_015  | Customer tidak bisa akses report | GET /api/report/sales | status 403 |
| TC_CUST_016  | Customer tidak bisa update reservasi | PUT /api/reservation/:id | status 403 |
| TC_CUST_017  | Customer tidak bisa delete reservasi | DELETE /api/reservation/:id | status 403 |
| TC_CUST_018  | Integration flow: login, lihat menu, lihat meja, buat reservasi, coba order & payment (gagal) | End-to-end | step sukses kecuali order & payment 403 |
*/

// ============================================================
// 6. BUG REPORT (CONTOH)
// ============================================================
/*
BUG REPORT
----------
ID: BUG-001
Title: Customer dapat mengakses endpoint /api/reservation/all dan melihat reservasi milik customer lain (tidak terfilter)
Severity: Medium
Priority: High
Environment: Integration test (local)
Description:
  Pada role Customer, endpoint GET /api/reservation/all seharusnya hanya mengembalikan reservasi milik customer yang sedang login.
  Namun pada implementasi saat ini, customer dapat melihat semua reservasi dari semua user (termasuk milik manager atau customer lain).
  Hal ini terlihat pada test TC_CUST_008 ketika customer melihat reservasi dummy yang dibuat untuk customer tersebut, tetapi jika ada reservasi dari user lain, juga terlihat.
Steps to Reproduce:
  1. Login sebagai Customer.
  2. GET /api/reservation/all dengan token customer.
  3. Perhatikan response: terdapat reservasi dengan userId selain customerId.
Expected Result:
  Hanya reservasi dengan userId = customerId yang tampil.
Actual Result:
  Semua reservasi tampil, termasuk milik user lain.
Suggested Fix:
  Tambahkan filter pada controller /api/reservation/all dengan kondisi userId = req.user.id (dari token).
  Atau jika endpoint tersebut memang untuk admin/manager, maka berikan middleware role check dan batasi akses untuk customer hanya ke reservasi sendiri.
Attachments:
  - Test case TC_CUST_008
  - Log response: [contoh response]
Reported by: QA Team
Date: 2026-07-23
*/