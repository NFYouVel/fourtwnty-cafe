import { useEffect, useRef, useState } from "react";
import { Container, Typography, TextField, Button, Paper, Stack, Box, FormControl, InputLabel, Select, MenuItem, ListSubheader } from "@mui/material";
import { useNavigate } from "react-router";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Popover } from "@mui/material";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

export default function ReservationPage() {
    const navigate = useNavigate();
    const formRef = useRef<HTMLDivElement>(null)
    const [form, setForm] = useState({
        tanggal_reservation: new Date().toISOString().split('T')[0],
        jumlah_orang: '',
        table_number: ''
    });

    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/tableInformation/availability?tanggal=${form.tanggal_reservation}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setTables(data);
                }
            } catch (error) {
                console.error("Gagal load status meja:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTables();
    }, [form.tanggal_reservation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/reservation/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Reservasi Berhasil!");
                navigate("/home");
            } else {
                alert(result.message || "Reservasi Gagal")
            }
        } catch (error) {
            alert("Terjadi kesalahan koneksi");
        }
    };

    const indoorTables = tables.filter(t => t.area === 'Indoor');
    const outdoorTables = tables.filter(t => t.area === 'Outdoor');

    const handleClick = () => {
        if (formRef.current) {
            setAnchorEl(formRef.current);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectTable = (tableNumber: string) => {
        setForm({ ...form, table_number: tableNumber });
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'table-popover' : undefined;

    return (
        <>
            <Header />
            <HeaderDashboard />
            <Container maxWidth="sm" sx={{ py: 10 }}>
                <Paper ref={formRef} elevation={4} sx={{ p: 4, borderRadius: 4, borderTop: '8px solid var(--potting-soil)' }}>
                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <CalendarMonthIcon sx={{ fontSize: 40, color: 'var(--potting-soil)' }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Book a Table</Typography>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Tanggal Reservasi" type="date" fullWidth required
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={form.tanggal_reservation}
                                onChange={(e) => setForm({ ...form, tanggal_reservation: e.target.value })}
                            />

                            <TextField
                                label="Jumlah Orang" type="number" fullWidth required
                                value={form.jumlah_orang}
                                onChange={(e) => setForm({ ...form, jumlah_orang: e.target.value })}
                            />

                            <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
                                <TextField
                                    label="Pilih Nomor Meja"
                                    fullWidth
                                    value={form.table_number ? `Meja #${form.table_number}` : ''}
                                    placeholder="Klik untuk memilih meja"
                                    slotProps={{ input: { readOnly: true, sx: { pointerEvents: 'none' } } }}
                                    required
                                />
                            </Box>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                marginThreshold={0}
                                anchorOrigin={{
                                    vertical: 'top', 
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                PaperProps={{
                                    sx: {
                                        width: 360,
                                        maxHeight: 467,
                                        borderRadius: 3,
                                        mt: 0, 
                                        boxShadow: '0px 10px 40px rgba(0,0,0,0.15)',
                                        border: '1px solid #eee',
                                        overflow: 'hidden', 
                                    }
                                }}
                            >
                               
                                <Box sx={{
                                    maxHeight: 467, 
                                    overflowY: 'auto',
                                    p: 1,
                                    '&::-webkit-scrollbar': { width: '6px' },
                                    '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
                                    '&::-webkit-scrollbar-thumb': { background: 'var(--potting-soil)', borderRadius: '10px' },
                                }}>

                                    <ListSubheader
                                        disableSticky 
                                        sx={{
                                            fontWeight: 'bold', bgcolor: '#fdf8f5', textAlign: 'center',
                                            borderRadius: 1, mb: 2, mt: 1, lineHeight: '40px', position: 'static',
                                            color: 'var(--potting-soil)'
                                        }}
                                    >
                                        INDOOR AREA
                                    </ListSubheader>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 65px)', gap: '12px', mb: 4, justifyContent: 'center' }}>
                                        {indoorTables.map((table) => {
                                            const isLocked = table.is_booked || table.status === 'Unavailable';
                                            const isSelected = form.table_number === String(table.table_number);
                                            return (
                                                <Button
                                                    key={table.id} variant="contained" disabled={isLocked}
                                                    onClick={() => handleSelectTable(String(table.table_number))}
                                                    sx={{
                                                        width: '65px', height: '65px', borderRadius: 2, p: 0,
                                                        fontWeight: 'bold', fontSize: '1rem',
                                                        bgcolor: isSelected ? 'var(--potting-soil)' : 'var(--mocha-mousse)',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: isSelected ? 'var(--potting-soil)' : 'var(--pepper-rice)' }
                                                    }}
                                                >
                                                    #{table.table_number}
                                                </Button>
                                            );
                                        })}
                                    </Box>

                                    <ListSubheader
                                        disableSticky
                                        sx={{
                                            fontWeight: 'bold', bgcolor: '#fdf8f5', textAlign: 'center',
                                            borderRadius: 1, mb: 2, mt: 1, lineHeight: '40px', position: 'static',
                                            color: 'var(--pepper-rice)'
                                        }}
                                    >
                                        OUTDOOR AREA
                                    </ListSubheader>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 65px)', gap: '12px', mb: 2, justifyContent: 'center' }}>
                                        {outdoorTables.map((table) => {
                                            const isLocked = table.is_booked || table.status === 'Unavailable';
                                            const isSelected = form.table_number === String(table.table_number);
                                            return (
                                                <Button
                                                    key={table.id} variant="contained" disabled={isLocked}
                                                    onClick={() => handleSelectTable(String(table.table_number))}
                                                    sx={{
                                                        width: '65px', height: '65px', borderRadius: 2, p: 0,
                                                        fontWeight: 'bold', fontSize: '1rem',
                                                        bgcolor: isSelected ? 'var(--potting-soil)' : 'var(--mocha-mousse)',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: isSelected ? 'var(--potting-soil)' : 'var(--pepper-rice)' }
                                                    }}
                                                >
                                                    #{table.table_number}
                                                </Button>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Popover>


                            <Button
                                type="submit" variant="contained" size="large"
                                sx={{ bgcolor: 'var(--potting-soil)', py: 1.5 }}
                            >
                                Confirm Reservation
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container >
        </>
    )
}
