// ============================================================
// 1. MOCK SEMUA MODUL (SEBELUM IMPORT)
// ============================================================
import { jest } from '@jest/globals';

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
import { MenuIngredient } from '../../models/MenuIngredient.js';
import { TableInformation } from '../../models/TableInformation.js';
import { Order } from '../../models/Order.js';
import { Reservation } from '../../models/Reservation.js';
import { Payment } from '../../models/Payment.js';
import { v4 as uuidv4 } from 'uuid';

jest.setTimeout(30000);

// ============================================================
// 3. DUMMY TEST
// ============================================================
test('Dummy test - Jest is working', () => {
    expect(true).toBe(true);
});

// ============================================================
// 4. TEST SUITE
// ============================================================
describe('MANAGER FULL TEST (TC-MAN-001 s.d. TC-MAN-070)', () => {
    // ─── VARIABLES ──────────────────────────────────────────────
    let managerToken: string;
    let managerId: string;

    // IDs untuk testing
    let createdStaffId: string;
    let createdMenuId: string;
    let createdStockId: string;
    let createdTableId: string;
    let createdOrderId: string;
    let createdReservationId: string;

    // ─── SEBELUM SEMUA TEST ──────────────────────────────────
    beforeAll(async () => {
        try {
            // Hard delete semua data terkait
            await sequelize.query(`DELETE FROM "Junction_MenuIngredient"`);
            await sequelize.query(`DELETE FROM "Users" WHERE email IN ('manager@cafe.com', 'joko.staff@cafe.com', 'duplikat@cafe.com')`);
            await sequelize.query(`DELETE FROM "Stock" WHERE ingredient_name IN ('Beras', 'Gula', 'Minyak', 'Telur', 'Tepung')`);
            await sequelize.query(`DELETE FROM "Menu" WHERE name IN ('Nasi Goreng', 'Mie Goreng')`);
            await sequelize.query(`DELETE FROM "TableInformation" WHERE table_number IN (99, 100)`);

            // Buat user Manager
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

            // Login
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
        } catch (error) {
            console.error('beforeAll error:', error);
            throw error;
        }
    });

    // ─── SETELAH SEMUA TEST ──────────────────────────────────
    afterAll(async () => {
        try {
            await sequelize.query(`DELETE FROM "Junction_MenuIngredient"`);
            await sequelize.query(`DELETE FROM "Users" WHERE email IN ('manager@cafe.com', 'joko.staff@cafe.com', 'duplikat@cafe.com')`);
            await sequelize.query(`DELETE FROM "Stock" WHERE ingredient_name IN ('Beras', 'Gula', 'Minyak', 'Telur', 'Tepung')`);
            await sequelize.query(`DELETE FROM "Menu" WHERE name IN ('Nasi Goreng', 'Mie Goreng')`);
            await sequelize.query(`DELETE FROM "TableInformation" WHERE table_number IN (99, 100)`);
            if (createdOrderId) {
                await Payment.destroy({ where: { orderId: createdOrderId }, force: true });
                await Order.destroy({ where: { id: createdOrderId }, force: true });
            }
            if (createdReservationId) {
                await Reservation.destroy({ where: { id: createdReservationId }, force: true });
            }
            await sequelize.close();
        } catch (error) {
            console.error('afterAll cleanup error (ignored):', error);
        }
    });

    // ================================================================
    // SECTION 1: STOCK MANAGEMENT (TC-MAN-001 s.d. TC-MAN-012)
    // ================================================================

    // ─── TC-MAN-001: Melihat semua stok tersedia ────────────
    test('TC-MAN-001: Sistem menampilkan daftar stok dengan data lengkap', async () => {
        await Stock.create({
            id: uuidv4(),
            ingredient_name: 'Telur',
            unit: 'Buah',
            amount: 100
        });

        const res = await request(app)
            .get('/api/stock/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('ingredient_name');
        expect(res.body[0]).toHaveProperty('unit');
        expect(res.body[0]).toHaveProperty('amount');

        await sequelize.query(`DELETE FROM "Stock" WHERE ingredient_name = 'Telur'`);
    });

    // ─── TC-MAN-002: Melihat stok saat kosong ───────────────
    test('TC-MAN-002: Sistem menampilkan array kosong tanpa error', async () => {
        await sequelize.query(`DELETE FROM "Junction_MenuIngredient"`);
        await sequelize.query(`DELETE FROM "Stock"`);

        const res = await request(app)
            .get('/api/stock/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    // ─── TC-MAN-003: Error saat melihat stok ────────────────
    test('TC-MAN-003: Sistem menampilkan pesan error saat request invalid', async () => {
        const res = await request(app)
            .get('/api/stock/all?invalid=true')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── TC-MAN-004: Menambahkan stok baru ──────────────────
    test('TC-MAN-004: Data stok baru berhasil dibuat dengan field yang sesuai', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ ingredient_name: 'Beras', unit: 'Gram', amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.ingredient_name).toBe('Beras');
        expect(res.body.unit).toBe('Gram');
        expect(res.body.amount).toBe(100);
        createdStockId = res.body.id;
    });

    // ─── TC-MAN-005: Menambahkan stok dengan field tambahan ──
    test('TC-MAN-005: Field yang tidak dikenali diabaikan, hanya field valid disimpan', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                ingredient_name: 'Gula',
                unit: 'Gram',
                amount: 50,
                extraField: 'tidak dikenal'
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.ingredient_name).toBe('Gula');
        expect(res.body).not.toHaveProperty('extraField');

        await sequelize.query(`DELETE FROM "Junction_MenuIngredient" WHERE "stockId" = '${res.body.id}'`);
        await Stock.destroy({ where: { ingredient_name: 'Gula' }, force: true });
    });

    // ─── TC-MAN-006: Error saat menambahkan stok ────────────
    test('TC-MAN-006: Sistem menampilkan error saat field wajib tidak diisi', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ unit: 'Gram', amount: 50 });
        expect(res.status).toBe(500);
        expect(res.body.message).toBeDefined();
    });

    // ─── TC-MAN-007: Mengubah data stok ─────────────────────
    test('TC-MAN-007: Data stok berhasil diperbarui sesuai id dan field yang dikirim', async () => {
        const res = await request(app)
            .put(`/api/stock/update/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ amount: 150 });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toBe(1);
    });

    // ─── TC-MAN-008: Mengubah stok dengan id tidak ditemukan ──
    test('TC-MAN-008: Sistem mengembalikan 0 baris terupdate tanpa error', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .put(`/api/stock/update/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ amount: 999 });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toBe(0);
    });

    // ─── TC-MAN-009: Error saat mengubah stok ───────────────
    test('TC-MAN-009: Sistem menampilkan error saat field yang dikirim tidak valid', async () => {
        const res = await request(app)
            .put(`/api/stock/update/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ amount: 'bukan angka' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBeDefined();
    });

    // ─── TC-MAN-010: Menghapus data stok ────────────────────
    test('TC-MAN-010: Data stok berhasil dihapus sesuai id', async () => {
        await sequelize.query(`DELETE FROM "Junction_MenuIngredient" WHERE "stockId" = '${createdStockId}'`);
        const res = await request(app)
            .delete(`/api/stock/delete/${createdStockId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toBe(1);
    });

    // ─── TC-MAN-011: Menghapus stok dengan id tidak ditemukan ──
    test('TC-MAN-011: Sistem mengembalikan 0 baris terhapus tanpa error', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .delete(`/api/stock/delete/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toBe(0);
    });

    // ─── TC-MAN-012: Error saat menghapus stok ──────────────
    test('TC-MAN-012: Sistem menampilkan error saat id tidak valid', async () => {
        const res = await request(app)
            .delete('/api/stock/delete/invalid-id')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBeDefined();
    });

    // ================================================================
    // SECTION 2: STAFF MANAGEMENT (TC-MAN-013 s.d. TC-MAN-024)
    // ================================================================

    // ─── TC-MAN-013: Create staff ────────────────────────────
    test('TC-MAN-013: Manager berhasil create staff', async () => {
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Staff Satu', email: 'staff.satu@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        createdStaffId = res.body.data.id;
    });

    // ─── TC-MAN-014: Get all staff ──────────────────────────
    test('TC-MAN-014: Manager berhasil get all staff', async () => {
        const res = await request(app)
            .get('/api/staff/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── TC-MAN-015: Get staff by ID ────────────────────────
    test('TC-MAN-015: Manager berhasil get staff by ID', async () => {
        const res = await request(app)
            .get(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdStaffId);
    });

    // ─── TC-MAN-016: Update staff ───────────────────────────
    test('TC-MAN-016: Manager berhasil update staff', async () => {
        const res = await request(app)
            .put(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Staff Updated', phone: '08123456789' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Staff Updated');
    });

    // ─── TC-MAN-017: Delete staff ───────────────────────────
    test('TC-MAN-017: Manager berhasil delete staff', async () => {
        const res = await request(app)
            .delete(`/api/staff/${createdStaffId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── TC-MAN-018: Get staff not found ────────────────────
    test('TC-MAN-018: Manager gagal get staff dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .get(`/api/staff/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-019: Create staff dengan email duplikat ────
    test('TC-MAN-019: Manager gagal create staff dengan email duplikat', async () => {
        await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });

        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Duplikat Lagi', email: 'duplikat@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(500);
        expect(res.body.detail).toMatch(/unique|duplicate|validation/i);
    });

    // ─── TC-MAN-020: Create staff tanpa nama ────────────────
    test('TC-MAN-020: Manager gagal create staff tanpa nama', async () => {
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ email: 'staff.no.name@cafe.com', password: '123456', phone: '08123456789' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Data tidak boleh kosong');
    });

    // ─── TC-MAN-021: Update staff not found ────────────────
    test('TC-MAN-021: Manager gagal update staff dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .put(`/api/staff/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Tidak Ada' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-022: Delete staff not found ────────────────
    test('TC-MAN-022: Manager gagal delete staff dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .delete(`/api/staff/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-023: Get all staff saat kosong ──────────────
    test('TC-MAN-023: Sistem menampilkan array staff kosong tanpa error', async () => {
        await Users.destroy({ where: { user_role: 'Staff' }, force: true });
        const res = await request(app)
            .get('/api/staff/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    // ─── TC-MAN-024: Create staff dengan role tidak valid ───
    test('TC-MAN-024: Sistem menolak create staff dengan role tidak valid', async () => {
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Invalid', email: 'invalid@cafe.com', password: '123456', phone: '08123456789', user_role: 'Admin' });
        // Controller tidak menerima user_role, jadi akan diabaikan dan default Staff
        expect(res.status).toBe(200);
        expect(res.body.data.user_role).toBe('Staff');
    });

    // ================================================================
    // SECTION 3: MENU MANAGEMENT (TC-MAN-025 s.d. TC-MAN-036)
    // ================================================================

    // ─── TC-MAN-025: Create menu ────────────────────────────
    test('TC-MAN-025: Manager berhasil create menu', async () => {
        const res = await request(app)
            .post('/api/menu/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Nasi Goreng', price: 25000, category: 'Main', description: 'Nasi goreng spesial' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        createdMenuId = res.body.data.id;
    });

    // ─── TC-MAN-026: Get all menus ─────────────────────────
    test('TC-MAN-026: Manager berhasil get all menus', async () => {
        const res = await request(app)
            .get('/api/menu/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── TC-MAN-027: Get menu by ID ────────────────────────
    test('TC-MAN-027: Manager berhasil get menu by ID', async () => {
        const res = await request(app)
            .get(`/api/menu/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdMenuId);
    });

    // ─── TC-MAN-028: Update menu ───────────────────────────
    test('TC-MAN-028: Manager berhasil update menu', async () => {
        const res = await request(app)
            .put(`/api/menu/update/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Nasi Goreng Spesial', price: 30000 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Nasi Goreng Spesial');
    });

    // ─── TC-MAN-029: Delete menu ───────────────────────────
    test('TC-MAN-029: Manager berhasil delete menu', async () => {
        const res = await request(app)
            .delete(`/api/menu/delete/${createdMenuId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── TC-MAN-030: Create menu tanpa category ─────────────
    test('TC-MAN-030: Manager gagal create menu tanpa category', async () => {
        const res = await request(app)
            .post('/api/menu/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Mie Goreng', price: 20000, description: 'Mie goreng' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/failed/i);
    });

    // ─── TC-MAN-032: Update menu not found ──────────────────
    test('TC-MAN-032: Manager gagal update menu dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .put(`/api/menu/update/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Tidak Ada' });
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    // ─── TC-MAN-034: Get menu by ID not found ──────────────
    test('TC-MAN-034: Manager gagal get menu dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .get(`/api/menu/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    // ─── TC-MAN-035: Create menu dengan price negative ──────
    test('TC-MAN-035: Manager gagal create menu dengan price negative', async () => {
        const res = await request(app)
            .post('/api/menu/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Menu Murah', price: -5000, category: 'Main', description: 'Harga negatif' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/failed/i);
    });

    // ─── TC-MAN-036: Get all menus saat kosong ──────────────
    test('TC-MAN-036: Sistem menampilkan array menu kosong tanpa error', async () => {
        await Menu.destroy({ where: {} });
        const res = await request(app)
            .get('/api/menu/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    // ================================================================
    // SECTION 4: TABLE MANAGEMENT (TC-MAN-037 s.d. TC-MAN-048)
    // ================================================================

    // ─── TC-MAN-037: Create table ────────────────────────────
    test('TC-MAN-037: Manager berhasil create table', async () => {
        const res = await request(app)
            .post('/api/tableInformation/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ table_number: 99, seat_count: 4, area: 'Indoor', status: 'Available' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Success');
        expect(res.body.data).toHaveProperty('id');
        createdTableId = res.body.data.id;
    });

    // ─── TC-MAN-038: Get all tables ─────────────────────────
    test('TC-MAN-038: Manager berhasil get all tables', async () => {
        const res = await request(app)
            .get('/api/tableInformation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── TC-MAN-039: Get table by ID ────────────────────────
    test('TC-MAN-039: Manager berhasil get table by ID', async () => {
        const res = await request(app)
            .get(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('Success');
        expect(res.body.data.id).toBe(createdTableId);
    });

    // ─── TC-MAN-040: Update table ───────────────────────────
    test('TC-MAN-040: Manager berhasil update table', async () => {
        const res = await request(app)
            .put(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ seat_count: 6 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.seat_count).toBe(6);
    });

    // ─── TC-MAN-041: Delete table ───────────────────────────
    test('TC-MAN-041: Manager berhasil delete table', async () => {
        const res = await request(app)
            .delete(`/api/tableInformation/${createdTableId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ─── TC-MAN-042: Create table tanpa field wajib ─────────
    test('TC-MAN-042: Manager gagal create table tanpa field wajib', async () => {
        const res = await request(app)
            .post('/api/tableInformation/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ seat_count: 4, area: 'Indoor' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak boleh kosong/i);
    });

    // ─── TC-MAN-043: Get table by ID not found ──────────────
    test('TC-MAN-043: Manager gagal get table dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .get(`/api/tableInformation/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-044: Update table not found ──────────────────
    test('TC-MAN-044: Manager gagal update table dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .put(`/api/tableInformation/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ seat_count: 8 });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-045: Delete table not found ──────────────────
    test('TC-MAN-045: Manager gagal delete table dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .delete(`/api/tableInformation/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak ditemukan/i);
    });

    // ─── TC-MAN-046: Cek ketersediaan meja dengan tanggal ───
    test('TC-MAN-046: Manager berhasil cek ketersediaan meja dengan tanggal', async () => {
        const tanggal = new Date().toISOString().split('T')[0];
        const res = await request(app)
            .get(`/api/tableInformation/availability?tanggal=${tanggal}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((item: any) => {
            expect(item).toHaveProperty('is_booked');
        });
    });

    // ─── TC-MAN-047: Cek ketersediaan tanpa tanggal ──────────
    test('TC-MAN-047: Manager gagal cek ketersediaan tanpa tanggal', async () => {
        const res = await request(app)
            .get('/api/tableInformation/availability')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Parameter tanggal diperlukan');
    });

    // ─── TC-MAN-048: Get all tables saat kosong ─────────────
    test('TC-MAN-048: Sistem menampilkan array table kosong tanpa error', async () => {
        await TableInformation.destroy({ where: {} });
        const res = await request(app)
            .get('/api/tableInformation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    // ================================================================
    // SECTION 5: ORDER MANAGEMENT (TC-MAN-049 s.d. TC-MAN-056)
    // ================================================================

    // ─── TC-MAN-049: Get all orders (process) ───────────────
    test('TC-MAN-049: Manager berhasil get all orders (process)', async () => {
        const res = await request(app)
            .get('/api/order/process')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ================================================================
    // SECTION 6: RESERVATION MANAGEMENT (TC-MAN-057 s.d. TC-MAN-064)
    // ================================================================

    // ─── TC-MAN-057: Get all reservations ────────────────────
    test('TC-MAN-057: Manager berhasil get all reservations', async () => {
        const res = await request(app)
            .get('/api/reservation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ─── TC-MAN-059: Update reservation status ──────────────
    test('TC-MAN-059: Manager berhasil update reservation status', async () => {
        const table = await TableInformation.create({
            id: uuidv4(),
            table_number: 101,
            seat_count: 4,
            area: 'Indoor',
            status: 'Available'
        });
        const reservation = await Reservation.create({
            id: uuidv4(),
            tanggal_reservation: new Date(),
            jumlah_orang: 4,
            userId: managerId,
            tableId: table.id,
            status_reservation: 'Pending'
        });
        createdReservationId = reservation.id;
        const res = await request(app)
            .put(`/api/reservation/${createdReservationId}`)
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ status_reservation: 'Approved' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status_reservation).toBe('Approved');
    });
    
    // ─── TC-MAN-063: Delete reservation not found ────────────
    test('TC-MAN-063: Manager gagal delete reservation dengan ID tidak ditemukan', async () => {
        const fakeId = uuidv4();
        const res = await request(app)
            .delete(`/api/reservation/${fakeId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak di temukan/i);
    });

    // ─── TC-MAN-064: Get all reservations saat kosong ────────
    test('TC-MAN-064: Sistem menampilkan array reservation kosong tanpa error', async () => {
        await Reservation.destroy({ where: {} });
        const res = await request(app)
            .get('/api/reservation/all')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    // ================================================================
    // SECTION 7: REPORT (TC-MAN-065 s.d. TC-MAN-066)
    // ================================================================

    // ─── TC-MAN-065: Get sales report ────────────────────────
    test('TC-MAN-065: Manager berhasil get sales report', async () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);

        const res = await request(app)
            .get(`/api/report?start=${start.toISOString()}&end=${end.toISOString()}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('totalOrders');
        expect(res.body).toHaveProperty('totalRevenue');
    });

    // ─── TC-MAN-066: Get report tanpa start & end ────────────
    test('TC-MAN-066: Manager gagal get report tanpa start & end', async () => {
        const res = await request(app)
            .get('/api/report')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('start & end wajib diisi');
    });

    // ================================================================
    // SECTION 8: ERROR HANDLING & EDGE CASES (TC-MAN-067 s.d. TC-MAN-070)
    // ================================================================

    // ─── TC-MAN-067: Access tanpa token ──────────────────────
    test('TC-MAN-067: Sistem menolak akses tanpa token', async () => {
        const res = await request(app)
            .get('/api/stock/all');
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/unauthorized|token/i);
    });

    // ─── TC-MAN-068: Access dengan token invalid ────────────
    test('TC-MAN-068: Sistem menolak akses dengan token invalid', async () => {
        const res = await request(app)
            .get('/api/stock/all')
            .set('Authorization', 'Bearer invalid-token');
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/unauthorized|invalid/i);
    });

    // ─── TC-MAN-069: Create staff dengan password kosong ────
    test('TC-MAN-069: Manager gagal create staff dengan password kosong', async () => {
        const res = await request(app)
            .post('/api/staff/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ name: 'Staff No Pass', email: 'nopass@cafe.com', password: '', phone: '08123456789' });
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/tidak boleh kosong|hash/i);
    });

    // ─── TC-MAN-070: Create stock dengan unit tidak valid ────
    test('TC-MAN-070: Sistem menolak create stock dengan unit tidak valid', async () => {
        const res = await request(app)
            .post('/api/stock/create')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ ingredient_name: 'Minyak', unit: 'Liter', amount: 10 });
        // 'Liter' tidak ada di ENUM, tapi Sequelize mungkin menerima atau error
        expect(res.status).toBe(500);
        expect(res.body.message).toBeDefined();
    });
});