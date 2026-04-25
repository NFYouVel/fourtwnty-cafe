import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

import {
    getAllTable,
    getTableDineInAvailability
} from "../services/api";

import "../styles/tableStatus.css";

/* TYPES */
type Table = {
    id: string;
    table_number: number;
    area: string;
};

type BusyTable = {
    id: string;
    table: {
        id: string;
        table_number: number;
        area: string;
    };
};

function TableStatusPage() {
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [busyTables, setBusyTables] = useState<BusyTable[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableData = await getAllTable();

                const busyData = await getTableDineInAvailability();

                setAllTables(tableData);
                setBusyTables(busyData);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* CHECK TABLE OCCUPIED */
    const isBusy = (tableId: string) => {
        return busyTables.some(
            (item) =>
                item.table.id === tableId
        );
    };

    const totalTables = allTables.length;

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="table-status-page">
                {/* HEADER */}
                <div className="table-status-header">
                    <h1>Table Status</h1>
                    <div className="summary-card total">
                        <h2>{totalTables}</h2>
                        <p>Total Tables</p>
                    </div>
                </div>

                {/* GRID */}
                <div className="table-grid">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        allTables.map((item) => {
                            const busy = isBusy(item.id);

                            return (
                                <div key={item.id}
                                    className={`table-box ${busy ? "busy" : "available"}`}
                                >
                                    <h3>Table{" "}{item.table_number}</h3>
                                    <span>{busy ? "Occupied" : "Available"}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}

export default TableStatusPage;
