import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Paper, Stack, Button,
    Chip, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
    CircularProgress
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';


type Reservation = {
    id: string;
    tanggal_reservation: string;
    jumlah_orang: number;
    status_reservation: string;
    tableId: string;
    userId: string;
    user?: { name: string };
    tableInformation?: { table_number: number };
}

export default function StaffListReservationPage() {
    const [reservations, setReservations] = useState<Record<string, Reservation[]>>({});
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/reservation/all");
            const result = await response.json();

            console.log("Cek hasil fetch:", result);
            const dataToProcess = Array.isArray(result) ? result : result.data;

            if (dataToProcess && Array.isArray(dataToProcess)) {
                const grouped = dataToProcess.reduce((acc, current) => {
                    // ✨ TIPS: Ambil tanggalnya 10 karakter aja (YYYY-MM-DD)
                    // Biar gak keganggu sama jam (07:00:00+07)
                    const date = current.tanggal_reservation.substring(0, 10);

                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(current);
                    return acc;
                }, {} as Record<string, Reservation[]>);

                setReservations(grouped);
            }
        } catch (error) {
            console.error("Gagal ambil reservasi:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => { fetchAll(); }, []);

    const handleUpdateStatus = async () => {
        if (!selectedRes) {
            return;
        }

        await fetch(`http://localhost:5000/api/reservation/${selectedRes.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status_reservation: selectedRes.status_reservation })
        });

        setOpenEdit(false);
        fetchAll();
    };

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'var(--potting-soil)' }}>
                Staff Reservation List
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : Object.keys(reservations).length === 0 ? (
                <Typography align="center" sx={{ py: 10, color: '#999' }}>
                    Tidak ada reservasi.
                </Typography>
            ) : (
                Object.keys(reservations).sort().map((date) => (
                    <Box key={date} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ bgcolor: 'var(--mocha-mousse)', color: 'white', p: 1, px: 2, borderRadius: 2 }}>
                            📅 Tanggal: {date}
                        </Typography>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {reservations[date].map((res) => (
                                <Paper key={res.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            User: {res.user?.name || "Unknown User"}
                                        </Typography>
                                        <Typography variant="body2">
                                            Meja: <strong>#{res.tableInformation?.table_number || "N/A"}</strong>
                                            <span style={{ fontSize: '11px', marginLeft: '5px' }}>
                                                [ID: {res.tableId.substring(0, 5)}...]
                                            </span>
                                            <span style={{ margin: '0 8px' }}>|</span>
                                            {res.jumlah_orang} Orang
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip
                                            label={res.status_reservation}
                                            color={res.status_reservation === 'Pending' ? 'warning' : 'success'}
                                        />
                                        <IconButton onClick={() => { setSelectedRes(res); setOpenEdit(true); }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                ))
            )}

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Update Reservation Status</DialogTitle>
                <DialogContent sx={{ minWidth: 300, mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={selectedRes?.status_reservation || ''}
                            label="Status"
                            onChange={(e) => setSelectedRes(prev => prev ? { ...prev, status_reservation: e.target.value } : null)}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Reschedule">Reschedule</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleUpdateStatus} variant="contained" sx={{ bgcolor: 'var(--potting-soil)' }}>
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}