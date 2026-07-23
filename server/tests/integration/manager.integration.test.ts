// ============================================================
// 1. MOCK SEMUA MODUL (SEBELUM IMPORT)
// ============================================================
import { jest } from '@jest/globals';

// Mock library eksternal (bcrypt, jwt) - biarkan uuid asli
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockImplementation((pwd) => Promise.resolve('hashed_' + pwd)),
    compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('dummy-token'),
    verify: jest.fn().mockReturnValue({ id: 'dummy-id', role: 'Manager' }),
}));

// ============================================================
// 2. IMPORT MODUL
// ============================================================
import request from 'supertest';
import app from '../../src/server.js';
import { sequelize } from '../../src/config/database.js';
import jwt from 'jsonwebtoken';
import { Users } from '../../models/Users.js';
import bcrypt from 'bcrypt';
import { Menu } from '../../models/Menu.js';
import { Stock } from '../../models/Stock.js';
import { TableInformation } from '../../models/TableInformation.js';
import { Order } from '../../models/Order.js';
import { Reservation } from '../../models/Reservation.js';
import { Payment } from '../../models/Payment.js';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// 3. SETUP TIMEOUT
// ============================================================
jest.setTimeout(30000);

// ============================================================
// 4. DUMMY TEST
// ============================================================
test('Dummy test - Jest is working', () => {
    expect(true).toBe(true);
});

// ============================================================
// 5. TEST SUITE
// ============================================================
describe('MANAGER ROLE – Full Integration Tests', () => {
    // ─── VARIABLES ──────────────────────────────────────────────
    let managerToken: string;
    let createdStaffId: string;
    let createdMenuId: string;
    let createdStockId: string;
    let createdTableId: string;
    let managerId: string;
    let dummyTableId: string;
    let dummyOrderIdForGet: string;
    let dummyReservationIdForGet: string;

    // ─── SEBELUM SEMUA TEST ─────────────────────────────────────
    beforeAll(async () => {
        try {
            // 1. Hapus data test yang mungkin tersisa
            await sequelize.query(`DELETE FROM "Users" WHERE email IN ('manager@cafe.com', 'joko.staff@cafe.com', 'duplikat@cafe.com')`);
            await Menu.destroy({ where: { name: 'Nasi Goreng' }, force: true });
            await Stock.destroy({ where: { ingredient_name: 'Beras' }, force: true });
            await TableInformation.destroy({ where: { table_number: 99 }, force: true });
            await TableInformation.destroy({ where: { table_number: 999 }, force: true });

            // 2. Buat user Manager
            managerId = uuidv4();
            const hashedPassword = await bcrypt.hash('manager123', 10);
            await Users.create({
                id: managerId,
                name: 'Manager',
                email: 'manager@cafe.com',
                password: hashedPassword,
                phone: '08123456789',
                user_role: 'Manager'
            });

            // 3. Login
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: 'manager@cafe.com', password: 'manager123' });

            if (loginRes.status === 200 && loginRes.body.token) {
                managerToken = loginRes.body.token;
            } else {
                const secret = process.env.JWT_SECRET || 'dummysecret';
                managerToken = jwt.sign(
                    { id: managerId, email: 'manager@cafe.com', role: 'Manager' },
                    secret,
                    { expiresIn: '1d' }
                );
                console.warn('⚠️ Using dummy token (login failed)');
            }
            expect(managerToken).toBeDefined();

            // ─── SEED DUMMY TABLE ───
            dummyTableId = uuidv4();
            await TableInformation.create({
                id: dummyTableId,
                table_number: 999,
                seat_count: 4,
                area: 'Indoor',
                status: 'Available'
            });

            // ─── SEED DUMMY ORDER ───
            const dummyOrderId = uuidv4();
            await Order.create({
                id: dummyOrderId,
                order_type: 'Dine-in',
                status: 'Process',
                total_price: 50000,
                userId: managerId,
                tableId: dummyTableId
            });
            dummyOrderIdForGet = dummyOrderId;

            // ─── SEED DUMMY PAYMENT ───
            await Payment.create({
                id: uuidv4(),
                orderId: dummyOrderId,
                status: 'Unpaid',
                method: null
            });

            // ─── SEED DUMMY RESERVATION ───
            const dummyReservationId = uuidv4();
            await Reservation.create({
                id: dummyReservationId,
                tanggal_reservation: new Date(),
                jumlah_orang: 4,
                userId: managerId,
                tableId: dummyTableId,
                status_reservation: 'Pending'
            });
            dummyReservationIdForGet = dummyReservationId;

        } catch (error) {
            console.error('beforeAll error:', error);
            throw error;
        }
    });

    // ─── SETELAH SEMUA TEST ──────────────────────────────────────
    afterAll(async () => {
        try {
            // Hapus data dengan urutan yang benar (anak -> induk)
            if (dummyReservationIdForGet) {
                await Reservation.destroy({ where: { id: dummyReservationIdForGet }, force: true });
            }
            if (dummyOrderIdForGet) {
                await Payment.destroy({ where: { orderId: dummyOrderIdForGet }, force: true });
                await Order.destroy({ where: { id: dummyOrderIdForGet }, force: true });
            }
            if (createdMenuId) {
                await Menu.destroy({ where: { id: createdMenuId }, force: true });
            }
            if (createdStockId) {
                await Stock.destroy({ where: { id: createdStockId }, force: true });
            }
            if (createdTableId) {
                await TableInformation.destroy({ where: { id: createdTableId }, force: true });
            }
            if (dummyTableId) {
                await TableInformation.destroy({ where: { id: dummyTableId }, force: true });
            }

            // Hapus semua user
            await sequelize.query(`DELETE FROM "Users" WHERE email IN ('manager@cafe.com', 'joko.staff@cafe.com', 'duplikat@cafe.com')`);

            // Tutup koneksi database
            await sequelize.close();
        } catch (error) {
            console.error('afterAll cleanup error (ignored):', error);
        }
    });

    // ─── DUMMY TEST ──────────────────────────────────────────────
    test('TC_DUMMY: Test suite is running', () => {
        expect(managerToken).toBeDefined();
    });

    // ─── STAFF CRUD ──────────────────────────────────────────────
    test('TC_MGR_001: Manager berhasil create staff', async () => {
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Joko Staff', email: 'joko.staff@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        createdStaffId = res.body.data.id;
    });

    test('TC_MGR_002: Manager berhasil get all staff', async () => {
        const res = await request(app)
            .get('/api/staff/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_003: Manager berhasil get staff by ID', async () => {
        const res = await request(app)
            .get(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdStaffId);
    });

    test('TC_MGR_004: Manager berhasil update staff', async () => {
        const res = await request(app)
            .put(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Joko Updated', phone: '08123456789' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Joko Updated');
    });

    test('TC_MGR_005: Manager berhasil delete staff', async () => {
        const res = await request(app)
            .delete(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── MENU CRUD ──────────────────────────────────────────────
    test('TC_MGR_010: Manager berhasil create menu', async () => {
        const res = await request(app)
            .post('/api/menu/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Nasi Goreng', price: 25000, category: 'Main', description: 'Nasi goreng spesial' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        createdMenuId = res.body.data.id;
    });

    test('TC_MGR_011: Manager berhasil get all menus', async () => {
        const res = await request(app)
            .get('/api/menu/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_012: Manager berhasil get menu by ID', async () => {
        const res = await request(app)
            .get(`/api/menu/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdMenuId);
    });

    test('TC_MGR_013: Manager berhasil update menu', async () => {
        const res = await request(app)
            .put(`/api/menu/update/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Nasi Goreng Spesial', price: 30000 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Nasi Goreng Spesial');
    });

    test('TC_MGR_014: Manager berhasil delete menu', async () => {
        const res = await request(app)
            .delete(`/api/menu/delete/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── STOCK CRUD ──────────────────────────────────────────────
    test('TC_MGR_020: Manager berhasil create stock', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ ingredient_name: 'Beras', unit: 'Gram', amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        createdStockId = res.body.id;
    });

    test('TC_MGR_021: Manager berhasil get all stocks', async () => {
        const res = await request(app)
            .get('/api/stock/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_022: Manager berhasil update stock', async () => {
        const res = await request(app)
            .put(`/api/stock/update/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ amount: 150 });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toBe(1);
    });

    test('TC_MGR_023: Manager berhasil delete stock', async () => {
        const res = await request(app)
            .delete(`/api/stock/delete/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toBe(1);
    });

    // ─── TABLE INFORMATION CRUD ──────────────────────────────────
    test('TC_MGR_030: Manager berhasil create table', async () => {
        const res = await request(app)
            .post('/api/tableInformation/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ table_number: 99, seat_count: 4, area: 'Indoor', status: 'Available' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Success');
        expect(res.body.data).toHaveProperty('id');
        createdTableId = res.body.data.id;
    });

    test('TC_MGR_031: Manager berhasil get all tables', async () => {
        const res = await request(app)
            .get('/api/tableInformation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_032: Manager berhasil get table by ID', async () => {
        const res = await request(app)
            .get(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Success');
        expect(res.body.data.id).toBe(createdTableId);
    });

    test('TC_MGR_033: Manager berhasil update table', async () => {
        const res = await request(app)
            .put(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ seat_count: 6 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.seat_count).toBe(6);
    });

    test('TC_MGR_034: Manager berhasil delete table', async () => {
        const res = await request(app)
            .delete(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('TC_MGR_035: Manager berhasil cek ketersediaan meja dengan tanggal', async () => {
        const tanggal = new Date().toISOString().split('T')[0];
        const res = await request(app)
            .get(`/api/tableInformation/availability?tanggal=${tanggal}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((item: any) => {
            expect(item).toHaveProperty('is_booked');
            expect(typeof item.is_booked).toBe('boolean');
        });
    });

    test('TC_MGR_036: Manager gagal cek ketersediaan tanpa tanggal', async () => {
        const res = await request(app)
            .get('/api/tableInformation/availability')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Parameter tanggal diperlukan');
    });

    // ─── ORDER ───────────────────────────────────────────────────
    test('TC_MGR_041: Manager berhasil get all orders (process)', async () => {
        const res = await request(app)
            .get('/api/order/process')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── RESERVATION ─────────────────────────────────────────────
    test('TC_MGR_051: Manager berhasil get all reservations', async () => {
        const res = await request(app)
            .get('/api/reservation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_053: Manager berhasil update reservation status', async () => {
        const res = await request(app)
            .put(`/api/reservation/${dummyReservationIdForGet}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ status_reservation: 'Approved' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status_reservation).toBe('Approved');
    });

    // ─── REPORT ──────────────────────────────────────────────────
    test('TC_MGR_060: Manager berhasil get sales report', async () => {
        // Buat tanggal range (30 hari terakhir)
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);

        const res = await request(app)
            .get(`/api/report?start=${start.toISOString()}&end=${end.toISOString()}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalOrders');
        expect(res.body).toHaveProperty('totalRevenue');
        expect(res.body).toHaveProperty('dineIn');
        expect(res.body).toHaveProperty('takeaway');
    });


    // ─── VALIDASI ERROR ──────────────────────────────────────────
    test('TC_MGR_070: Manager gagal create staff dengan email duplikat', async () => {
        await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });

        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat Lagi', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(500);
        // Error detail bisa berupa "Validation error", "SequelizeUniqueConstraintError", atau pesan lain
        expect(res.body.detail).toMatch(/unique|duplicate|already exists|validation/i);
    });
});