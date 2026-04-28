import { Request, Response } from "express";
import { Order } from "../../models/Order.js";
import { Op } from "sequelize";
import { Payment } from "../../models/Payment.js";

// Get Report
export const getReport = async (req: Request, res: Response) => {
try {
        const { start, end } = req.query;
        
        if (!start || !end) {
        return res.status(400).json({ message: "start & end wajib diisi" });
        }
        const startDate = new Date(start as string);
        startDate.setHours(0, 0, 0, 0); // 00 0 0 itu buat set waktu nya jadi awal hari, jadi misalnya start nya itu 2024-01-01 maka startDate nya itu bakal jadi 2024-01-01 00:00:00.000

        const endDate = new Date(end as string);
        endDate.setHours(23, 59, 59, 999); // 23 59 59 999 itu buat set waktu nya jadi akhir hari, jadi misalnya end nya itu 2024-01-31 maka endDate nya itu bakal jadi 2024-01-31 23:59:59.999

        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate], // Op itu operator dari sequelize buat ngefilter data berdasarkan kondisi tertentu, dalam kasus ini kita pake Op.between buat ngefilter order yang createdAt nya berada di antara startDate dan endDate
                },
            },
            include: [
                {
                    model: Payment,
                    required: true, //ini buat ngejoin table Payment, jadi nanti di hasil report kita bisa ngambil data payment nya juga, misalnya status payment nya apa, method payment nya apa, dll. Kita set required: true karena kita cuma mau ambil order yang punya payment, jadi kalau misalnya ada order yang belum punya payment maka order itu gak akan masuk ke hasil report
                    where: {
                        status: 'Paid', //ini buat ngefilter order yang payment status nya itu Paid, jadi nanti di hasil report kita cuma dapet order yang udah dibayar aja, kalau misalnya ada order yang payment status nya itu Unpaid atau Cancelled maka order itu gak akan masuk ke hasil report
                    }
                }
            ]
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) =>{
            const data = order.get();
            return sum + parseFloat(data.total_price as any);
        }, 0); //ini tuh looping biar ngambil total price dari setiap order terus dijumlahin jadi total revenue
        //reduce fungsinya buat ngubah array jadi nilai tunggal, dalam kasus ini kita ngubah array orders jadi total revenue dengan cara ngejumlahin total price dari setiap order 

        const dineIn = orders.filter(order => order.get().order_type === 'Dine-in').length; //buat ngambil order yang tipe nya Dine-in terus dihitung jumlahnya
        const takeaway = orders.filter(order => order.get().order_type === 'Takeaway').length; // buat ngambil order yang tipe nya Takeaway terus dihitung jumlahnya
        const closed = orders.filter(order => order.get().status === 'Closed').length; // buat ngambil order yang status nya Closed terus dihitung jumlahnya
        const cancelled = orders.filter(order => order.get().status === 'Cancelled').length; // buat ngambil order yang status nya Cancelled terus dihitung jumlahnya

        res.json({
            start,
            end,
            totalOrders,
            totalRevenue,
            dineIn,
            takeaway,
            closed,
            cancelled,
        });
    }
    catch (error) {
        console.error("REPORT ERROR:", error); //ini buat ngeprint error nya di console, jadi kalau misalnya ada error pas generate report kita bisa tau error nya apa
        res.status(500).json({ message: "Error generating report." });
    }
}

