import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Paper, Stack, Button,
    Chip, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
    CircularProgress, Divider, Avatar
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import GroupsIcon from '@mui/icons-material/Groups';
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

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
            const dataToProcess = Array.isArray(result) ? result : result.data;

            if (dataToProcess && Array.isArray(dataToProcess)) {
                const grouped = dataToProcess.reduce((acc, current) => {
                    const date = current.tanggal_reservation.substring(0, 10);
                    if (!acc[date]) acc[date] = [];
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
        if (!selectedRes) return;
        await fetch(`http://localhost:5000/api/reservation/${selectedRes.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status_reservation: selectedRes.status_reservation })
        });
        setOpenEdit(false);
        fetchAll();
    };

    // Helper warna status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'var(--potting-soil)';
            case 'Pending': return 'var(--pepper-rice)';
            case 'Rejected': return '#d32f2f';
            default: return 'var(--mocha-mousse)';
        }
    };

    return (
        <>
            <Header />
            <HeaderDashboard />
            <Box sx={{ minHeight: '100vh', bgcolor: 'var(--froth)', py: 6 }}>
                <Container maxWidth="md">
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
                        <Box sx={{ bgcolor: 'var(--potting-soil)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <CalendarMonthIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--potting-soil)' }}>
                            Reservation Manager
                        </Typography>
                    </Stack>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress sx={{ color: 'var(--potting-soil)' }} />
                        </Box>
                    ) : Object.keys(reservations).length === 0 ? (
                        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.5)', border: '2px dashed #ccc' }}>
                            <Typography sx={{ color: '#999', fontStyle: 'italic' }}>No reservations found yet.</Typography>
                        </Paper>
                    ) : (
                        Object.keys(reservations).sort().reverse().map((date) => (
                            <Box key={date} sx={{ mb: 6 }}>
                                <Divider textAlign="left" sx={{ mb: 3 }}>
                                    <Chip
                                        icon={<CalendarMonthIcon style={{ color: 'white' }} />}
                                        label={`Date: ${date}`}
                                        sx={{ bgcolor: 'var(--mocha-mousse)', color: 'white', fontWeight: 'bold', py: 2, px: 1, borderRadius: 2 }}
                                    />
                                </Divider>

                                <Stack spacing={2.5}>
                                    {reservations[date].map((res) => (
                                        <Paper
                                            key={res.id}
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                borderLeft: `8px solid ${getStatusColor(res.status_reservation)}`,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'transform 0.2s',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                                '&:hover': { transform: 'translateX(8px)', boxShadow: '0 6px 25px rgba(0,0,0,0.1)' }
                                            }}
                                        >
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Avatar sx={{ bgcolor: 'var(--dry-creek)', width: 56, height: 56 }}>
                                                    <PersonIcon sx={{ color: 'var(--potting-soil)' }} />
                                                </Avatar>

                                                <Box>
                                                    <Typography variant="h6" sx={{ color: 'var(--potting-soil)', fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>
                                                        {res.user?.name || "Anonymous User"}
                                                    </Typography>

                                                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />}>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                            <EventSeatIcon sx={{ fontSize: 18, color: '#777' }} />
                                                            <Typography variant="body2" color="text.secondary">Table <strong>#{res.tableInformation?.table_number}</strong></Typography>
                                                        </Stack>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                            <GroupsIcon sx={{ fontSize: 18, color: '#777' }} />
                                                            <Typography variant="body2" color="text.secondary"><strong>{res.jumlah_orang}</strong> Guests</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </Stack>

                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Chip
                                                    label={res.status_reservation.toUpperCase()}
                                                    sx={{
                                                        bgcolor: getStatusColor(res.status_reservation),
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.7rem',
                                                        letterSpacing: 1
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => { setSelectedRes(res); setOpenEdit(true); }}
                                                    sx={{ bgcolor: 'var(--froth)', '&:hover': { bgcolor: 'var(--dry-creek)' } }}
                                                >
                                                    <EditIcon sx={{ color: 'var(--potting-soil)' }} fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        ))
                    )}

                    {/* Dialog Edit - Style Minimalist */}
                    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
                        <DialogTitle sx={{ fontWeight: 'bold', color: 'var(--potting-soil)' }}>Update Reservation Status</DialogTitle>
                        <DialogContent sx={{ minWidth: 350, mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                                Updating status for <strong>{selectedRes?.user?.name}</strong> (Table #{selectedRes?.tableInformation?.table_number})
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={selectedRes?.status_reservation || ''}
                                    label="Status"
                                    onChange={(e) => setSelectedRes(prev => prev ? { ...prev, status_reservation: e.target.value } : null)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="Pending">🕒 Pending</MenuItem>
                                    <MenuItem value="Approved">✅ Approved</MenuItem>
                                    <MenuItem value="Reschedule">🔄 Reschedule</MenuItem>
                                    <MenuItem value="Rejected">❌ Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpenEdit(false)} variant="text" color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
                            <Button
                                onClick={handleUpdateStatus}
                                variant="contained"
                                sx={{ bgcolor: 'var(--potting-soil)', textTransform: 'none', borderRadius: 2, px: 4 }}
                            >
                                Update Now
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </>
    );
}