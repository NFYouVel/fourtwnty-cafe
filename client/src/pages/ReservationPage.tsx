import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Paper, Stack, Box, FormControl, InputLabel, Select, MenuItem, ListSubheader } from "@mui/material";
import { useNavigate } from "react-router";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function ReservationPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        tanggal_reservation: '',
        jumlah_orang: '',
        table_number: ''
    });
    const [availableTables, setAvailableTables] = useState<any[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            const response = await fetch("http://localhost:5000/api/tableInformation/all");
            const data = await response.json();
            setAvailableTables(data.filter((t: any) => t.status === 'Available'));
        }
        fetchTables();
    }, [])

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

    const indoorTables = availableTables.filter(t => t.area === 'Indoor');
    const outdoorTables = availableTables.filter(t => t.area === 'Outdoor');

    return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, borderTop: '8px solid var(--potting-soil)' }}>
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

                        <FormControl fullWidth>
                            <InputLabel>Pilih Nomor Meja</InputLabel>

                            <Select
                                value={form.table_number}
                                label="Pilih Nomor Meja"
                                onChange={(e) => setForm({ ...form, table_number: e.target.value })}

                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 400,
                                            borderRadius: 3,
                                            mt: 1,
                                        }
                                    },
                                    MenuListProps: {
                                        sx: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: 1.5,
                                            p: 2,
                                        }
                                    }
                                }}
                            >
                                {/* INDOOR */}
                                <ListSubheader sx={{ gridColumn: 'span 4', fontWeight: 'bold' }}>
                                    INDOOR AREA
                                </ListSubheader>

                                {indoorTables.map((table) => (
                                    <MenuItem
                                        key={table.id}
                                        value={table.table_number}
                                        sx={{
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            aspectRatio: '1 / 1',

                                            bgcolor:
                                                form.table_number === table.table_number
                                                    ? 'var(--potting-soil)'
                                                    : 'var(--mocha-mousse)',

                                            color: 'white',
                                            fontWeight: 'bold',

                                            '&:hover': {
                                                bgcolor: 'var(--pepper-rice)',
                                            }
                                        }}
                                    >
                                        {table.table_number}
                                    </MenuItem>
                                ))}

                                {/* OUTDOOR */}
                                <ListSubheader sx={{ gridColumn: 'span 4', fontWeight: 'bold' }}>
                                    OUTDOOR AREA
                                </ListSubheader>

                                {outdoorTables.map((table) => (
                                    <MenuItem
                                        key={table.id}
                                        value={table.table_number}
                                        sx={{
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            aspectRatio: '1 / 1',

                                            bgcolor:
                                                form.table_number === table.table_number
                                                    ? 'var(--potting-soil)'
                                                    : 'var(--mocha-mousse)',

                                            color: 'white',
                                            fontWeight: 'bold',

                                            '&:hover': {
                                                bgcolor: 'var(--pepper-rice)',
                                            }
                                        }}
                                    >
                                        {table.table_number}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit" variant="contained" size="large"
                            sx={{ bgcolor: 'var(--potting-soil)', py: 1.5 }}
                        >
                            Confirm Reservation
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    )
}