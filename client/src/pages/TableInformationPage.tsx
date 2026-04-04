import { useEffect, useState } from "react";
import WeekendIcon from '@mui/icons-material/Weekend';
import DeckIcon from '@mui/icons-material/Deck';
import {
    Container, Typography, Box, Paper, TextField, Stack,
    CircularProgress, Divider, Chip
} from "@mui/material";

import "../styles/tableInformation.css";

type TableInformation = {
    id: string;
    table_number: number;
    seat_count: number;
    area: 'Indoor' | 'Outdoor';
    status: 'Available' | 'Unavailable';
    is_booked?: boolean;
}

export default function () {
    const [tables, setTables] = useState<TableInformation[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const [loading, setLoading] = useState<boolean>(false);
    //const [userRole] = useState<string>('Staff');
    const fetchTables = async (date: string) => {
        setLoading(true);
        try {
            // const response = await fetch(`http://localhost:5000/api/tableInformation/availability?tanggal=${date}`);
            const response = await fetch(`http://localhost:5000/api/tableInformation/all`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setTables(data);
            } else {
                console.error("Data bukan array:", data);
                setTables([]); 
            }
        } catch (error) {
            console.error("Koneksi ke Backend gagal:", error);
            setTables([]);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTables(selectedDate);
    }, [selectedDate]);

    const handleTable = (table: TableInformation) => {
        if (table.is_booked || table.status == 'Unavailable') {
            alert("Meja sudah penuh")
            return;
        }

        // if (userRole === 'Staff') {
        //     alert()
        // }
    }

    const renderTableGrid = (areaName: 'Indoor' | 'Outdoor') => (
        <Box className='table-grid'>
            {tables.filter(t => t.area === areaName).map((table) => {
                let statusClass = 'status-available';
                if (table.status === 'Unavailable') statusClass = 'status-broken';
                if (table.is_booked) statusClass = 'status-booked';

                return (
                    <Paper
                        key={table.id}
                        elevation={table.is_booked ? 0 : 4}
                        className={`table-card ${statusClass}`}
                        onClick={() => handleTable(table)}
                    >
                        <Typography variant='h5' className='table-number'>
                            #{table.table_number}
                        </Typography>
                        <Typography variant='caption' className='table-sub-info'>
                            Seats: {table.seat_count}
                        </Typography>
                    </Paper>
                );
            })}
        </Box>
    );

    return (
        <div className='layout-page'>
            <Container sx={{ py: 4 }}>
                <Typography
                    variant='h4'
                    align='center'
                    className='page-title'
                    sx={{ fontWeight: 'bold' }}
                >
                    Fourtwnty Cafe Table Information
                </Typography>

                <Box className='date-container'>
                    <TextField className='date-input' label='Reservation Date' type='date' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                </Box>

                <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                    <Chip label='Available' sx={{ bgcolor: 'var(--mocha-mousse)', color: 'white' }} />
                    <Chip label='Booked' sx={{ bgcolor: 'var(--pepper-rice)', color: 'white' }} />
                    <Chip label='Broken' sx={{ bgcolor: 'var(--spicy-coffee)', color: 'white' }} />
                </Stack>

                <Divider sx={{ mb: 4, color: 'var(--potting-soil)' }}>SITTING AREA</Divider>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress sx={{ color: 'var(--pepper-rice)' }} />
                    </Box>
                ) : (
                    <>
                        <Divider sx={{ mb: 4 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <WeekendIcon sx={{ color: 'var(--potting-soil)' }} />
                                <Typography sx={{ fontWeight: 'bold', color: 'var(--potting-soil)' }}>
                                    INDOOR AREA (AC & No Smoking)
                                </Typography>
                            </Stack>
                        </Divider>
                        {renderTableGrid('Indoor')}

                        <Divider sx={{ mt: 6, mb: 4 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <DeckIcon sx={{ color: 'var(--pepper-rice)' }} />
                                <Typography sx={{ fontWeight: 'bold', color: 'var(--pepper-rice)' }}>
                                    OUTDOOR AREA (Smoking Allowed)
                                </Typography>
                            </Stack>
                        </Divider>
                        {renderTableGrid('Outdoor')}
                    </>
                )}
            </Container>
        </div>
    )
}