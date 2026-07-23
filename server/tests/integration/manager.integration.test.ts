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
// 2. IMPORT MODUL (ASLI, TANPA MOCK SERVER)
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
import { v4 as uuidv4 } from 'uuid'; // <-- gunakan uuid asli

// ============================================================
// 3. DUMMY TEST
// ============================================================
test('Dummy test - Jest is working', () => {
    expect(true).toBe(true);
});

// ============================================================
// 4. TEST SUITE
// ============================================================
describe('MANAGER ROLE – Full Integration Tests', () => {
    let managerToken: string;
    let createdStaffId: string;
    let createdMenuId: string;
    let createdStockId: string;
    let createdTableId: string;
    let createdOrderId: string;
    let createdReservationId: string;
    let managerId: string; // simpan ID manager untuk keperluan foreign key

    // ─── SEBELUM SEMUA TEST: BERSIHKAN DATA & BUAT MANAGER ───
    beforeAll(async () => {
        // 1. Hapus data test yang mungkin tersisa
        await Users.destroy({ where: { email: ['manager@cafe.com', 'joko.staff@cafe.com'] }, force: true });
        await Menu.destroy({ where: { name: 'Nasi Goreng' }, force: true });
        await Stock.destroy({ where: { ingredient_name: 'Beras' }, force: true });
        await TableInformation.destroy({ where: { table_number: 99 }, force: true });

        // 2. Buat user Manager dengan UUID valid
        managerId = uuidv4(); // <-- ID valid
        const hashedPassword = await bcrypt.hash('manager123', 10);
        await Users.create({
            id: managerId,
            name: 'Manager',
            email: 'manager@cafe.com',
            password: hashedPassword,
            phone: '08123456789',
            user_role: 'Manager'
        });

        // 3. Login sebagai manager
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
    });

    // ─── SETELAH SEMUA TEST: BERSIHKAN DATA & TUTUP KONEKSI ───
    afterAll(async () => {
        // Hapus semua data yang dibuat selama test
        await Users.destroy({ where: { email: ['joko.staff@cafe.com'] }, force: true });
        await Users.destroy({ where: { email: ['manager@cafe.com'] }, force: true });
        await Menu.destroy({ where: { name: 'Nasi Goreng' }, force: true });
        await Stock.destroy({ where: { ingredient_name: 'Beras' }, force: true });
        await TableInformation.destroy({ where: { table_number: 99 }, force: true });

        await sequelize.close(); // Tutup koneksi DB agar Jest exit
    });

    test('TC_DUMMY: Test suite is running', () => {
        expect(managerToken).toBeDefined();
    });

    // ─── STAFF CRUD ────────────────────────────────────────────────────
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

    // ─── MENU CRUD ────────────────────────────────────────────────────
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

    // ─── STOCK CRUD ───────────────────────────────────────────────────
    test('TC_MGR_020: Manager berhasil create stock', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ ingredient_name: 'Beras', unit: 'Kg', amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        createdStockId = res.body.data.id;
    });

    test('TC_MGR_021: Manager berhasil get all stocks', async () => {
        const res = await request(app)
            .get('/api/stock/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_022: Manager berhasil get stock by ID', async () => {
        const res = await request(app)
            .get(`/api/stock/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdStockId);
    });

    test('TC_MGR_023: Manager berhasil update stock', async () => {
        const res = await request(app)
            .put(`/api/stock/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ amount: 150 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.amount).toBe(150);
    });

    test('TC_MGR_024: Manager berhasil delete stock', async () => {
        const res = await request(app)
            .delete(`/api/stock/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── TABLE INFORMATION CRUD ───────────────────────────────────────
    test('TC_MGR_030: Manager berhasil create table', async () => {
        const res = await request(app)
            .post('/api/tableInformation/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ table_number: 99, seat_count: 4, area: 'Indoor', status: 'Available' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
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

    // ─── ORDER CRUD ───────────────────────────────────────────────────
    test('TC_MGR_040: Manager berhasil create order', async () => {
        // Pastikan table dengan ID createdTableId ada
        const res = await request(app)
            .post('/api/order/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                order_type: 'Dine-in',
                tableId: createdTableId, // pakai table yang sudah dibuat
                total_price: 50000,
                userId: managerId
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        createdOrderId = res.body.data.id;
    });

    test('TC_MGR_041: Manager berhasil get all orders', async () => {
        const res = await request(app)
            .get('/api/order/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_042: Manager berhasil get order by ID', async () => {
        const res = await request(app)
            .get(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdOrderId);
    });

    test('TC_MGR_043: Manager berhasil update order status', async () => {
        const res = await request(app)
            .put(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ status: 'Closed' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('Closed');
    });

    test('TC_MGR_044: Manager berhasil delete order', async () => {
        const res = await request(app)
            .delete(`/api/order/${createdOrderId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── RESERVATION CRUD ────────────────────────────────────────────
    test('TC_MGR_050: Manager berhasil create reservation', async () => {
        const res = await request(app)
            .post('/api/reservation/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                tanggal_reservation: new Date(),
                jumlah_orang: 4,
                userId: managerId,
                tableId: createdTableId
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        createdReservationId = res.body.data.id;
    });

    test('TC_MGR_051: Manager berhasil get all reservations', async () => {
        const res = await request(app)
            .get('/api/reservation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('TC_MGR_052: Manager berhasil get reservation by ID', async () => {
        const res = await request(app)
            .get(`/api/reservation/${createdReservationId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdReservationId);
    });

    test('TC_MGR_053: Manager berhasil update reservation status', async () => {
        const res = await request(app)
            .put(`/api/reservation/${createdReservationId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ status_reservation: 'Approved' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status_reservation).toBe('Approved');
    });

    test('TC_MGR_054: Manager berhasil delete reservation', async () => {
        const res = await request(app)
            .delete(`/api/reservation/${createdReservationId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── REPORT ───────────────────────────────────────────────────────
    test('TC_MGR_060: Manager berhasil get sales report', async () => {
        const res = await request(app)
            .get('/api/report/sales') // sesuaikan endpoint
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    // ─── VALIDASI ERROR ──────────────────────────────────────────────
    test('TC_MGR_070: Manager gagal create staff dengan email duplikat', async () => {
        // Buat staff dulu
        await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });

        // Coba buat lagi dengan email yang sama
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat Lagi', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/duplicate/i);
    });
});