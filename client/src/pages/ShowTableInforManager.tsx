import { useEffect, useState } from "react";
import WeekendIcon from '@mui/icons-material/Weekend';
import DeckIcon from '@mui/icons-material/Deck';
import {
    Container, Typography, Box, Paper, TextField, Stack,
    CircularProgress, Divider, Chip,
    IconButton
} from "@mui/material";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "../styles/tableInformation.css";
import { useNavigate } from "react-router";
import AddIcon from '@mui/icons-material/Add';
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

type TableInformation = {
    id: string;
    table_number: number;
    seat_count: number;
    area: 'Indoor' | 'Outdoor';
    status: 'Available' | 'Unavailable';
    is_booked?: boolean;
    is_pending?: boolean;
}

export default function ShowTableInforManager() {
    const navigate = useNavigate();
    const [tables, setTables] = useState<TableInformation[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState<TableInformation | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchTables = async (date: string) => {
        setLoading(true);
        setTables([]);
        try {
            const response = await fetch(`http://localhost:5000/api/tableInformation/availability?tanggal=${date}`);
            const data = await response.json();

            console.log("Data Meja dari Backend:", data);

            if (Array.isArray(data)) {
                setTables(data);
            } else {
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
        if (table.is_booked || table.status === 'Unavailable' || table.is_pending) {
            alert("Meja tidak tersedia untuk dipilih");
            return;
        }
    }

    const handleDelete = async (e: React.MouseEvent, table: TableInformation) => {
        e.stopPropagation();
        if (table.status === 'Unavailable') {
            alert("Meja berstatus Unavailable tidak boleh dihapus!");
            return;
        }

        if (window.confirm(`Yakin ingin menghapus meja #${table.table_number}?`)) {
            try {
                await fetch(`http://localhost:5000/api/tableInformation/${table.id}`, { method: 'DELETE' });
                fetchTables(selectedDate);
            } catch (error) {
                alert("gagal menghapus")
            }
        }
    }

    const handleEdit = (e: React.MouseEvent, table: TableInformation) => {
        e.stopPropagation();
        setEditData(table);
        setOpenEdit(true);
    }

    const handleEditStatus = async () => {
        if (!editData) return;
        try {
            const response = await fetch(`http://localhost:5000/api/tableInformation/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: editData.status })
            });

            if (response.ok) {
                setOpenEdit(false);
                fetchTables(selectedDate);
            }
        } catch (error) {
            alert("Gagal Update status")
        }
    }

    const renderTableGrid = (areaName: 'Indoor' | 'Outdoor') => (
        <Box className='table-grid'>
            {tables.filter(t => t.area === areaName).map((table) => {
                let statusClass = 'status-available';

                if (table.is_booked) {
                    statusClass = 'status-booked'; 
                } else if (table.is_pending) {
                    statusClass = 'status-pending'; // ✨ Ini harus dicek sebelum status fisik
                } else if (table.status === 'Unavailable') {
                    statusClass = 'status-booked'; 
                }

                return (
                    <Paper
                        key={table.id}
                        elevation={(table.is_booked || table.is_pending) ? 0 : 4}
                        className={`table-card ${statusClass}`}
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            ...(table.is_pending && { 
                                bgcolor: '#bdbdbd !important', 
                                color: '#444 !important',
                                border: '1px solid #999',
                                opacity: 1 
                            })
                        }}
                    >
                        <Box sx={{ position: "absolute", top: 5, right: 5, display: 'flex' }}>
                            <IconButton size='small' onClick={(e) => handleEdit(e, table)} sx={{ color: 'white' }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size='small'
                                onClick={(e) => handleDelete(e, table)}
                                disabled={table.status === 'Unavailable'}
                                sx={{
                                    color: 'white',
                                    '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.3)' }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Typography variant='h5' className='table-number'>
                            #{table.table_number}
                        </Typography>
                        <Typography variant='caption' className='table-sub-info'>
                            Seats: {table.seat_count}
                        </Typography>
                        {table.is_pending && (
                            <Typography variant="overline" sx={{ fontSize: '8px', lineHeight: 1, fontWeight: 'bold' }}>
                                PENDING
                            </Typography>
                        )}
                    </Paper>
                );
            })}
        </Box>
    );

    return (
        <>
            <Header />
            <HeaderDashboard />
            <div className='layout-page'>
                <Container sx={{ py: 4 }}>
                    <Box sx={{ position: 'relative', mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography
                            variant='h4'
                            className='page-title'
                            sx={{ fontWeight: 'bold', textAlign: 'center', color: 'var(--potting-soil)' }}
                        >
                            Fourtwnty Cafe Table Information
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/tableInformation/create")}
                            sx={{
                                position: 'absolute',
                                right: 0,
                                bgcolor: 'var(--potting-soil)',
                                textTransform: 'none',
                                borderRadius: '8px',
                                '&:hover': { bgcolor: 'var(--pepper-rice)' }
                            }}
                        >
                            Add Table
                        </Button>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 3,
                            mb: 4,
                            p: 2,
                            bgcolor: 'rgba(0,0,0,0.03)',
                            borderRadius: '12px',
                            flexWrap: 'wrap'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--potting-soil)' }}>
                                VIEW DATE:
                            </Typography>
                            <TextField
                                type='date'
                                size="small"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                sx={{ bgcolor: 'white', borderRadius: '4px' }}
                            />
                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <Chip
                                label='Available'
                                size="small"
                                sx={{ bgcolor: 'var(--pepper-rice)', color: 'white', fontWeight: 'bold' }}
                            />
                            <Chip
                                label='Pending'
                                size="small"
                                sx={{ bgcolor: '#bdbdbd', color: 'white', fontWeight: 'bold' }}
                            />
                            <Chip
                                label='Booked'
                                size="small"
                                sx={{ bgcolor: 'var(--mocha-mousse)', color: 'white', fontWeight: 'bold' }}
                            />
                        </Stack>
                    </Paper>


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

                            <Divider sx={{ mt: 1, mb: 4 }}>
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

                    <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
                        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Table #{editData?.table_number}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Status Meja</InputLabel>
                                    <Select
                                        value={editData?.status || ''}
                                        label="Status Meja"
                                        onChange={(e) => setEditData(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                                    >
                                        <MenuItem value="Available">Available</MenuItem>
                                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpenEdit(false)} color="inherit">Batal</Button>
                            <Button onClick={handleEditStatus} variant="contained" sx={{ bgcolor: 'var(--potting-soil)' }}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Container>
            </div>
        </>
    )
}