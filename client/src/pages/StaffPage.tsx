import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Paper, Button, Stack,
    IconButton, CircularProgress, Divider, Avatar
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import "../styles/staff.css";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

type Staff = {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export default function StaffPage() {
    const navigate = useNavigate();
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/staff/all");
            const data = await response.json();
            if (Array.isArray(data)) {
                setStaffs(data);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah akan menghapus staff ini?")) {
            await fetch(`http://localhost:5000/api/staff/${id}`, {
                method: 'DELETE'
            });
            fetchStaff();
        }
    }

    return (
        <>
            <Header />
            <HeaderDashboard />
            <div className="staff-layout">
                <Container maxWidth="md" sx={{ py: 6 }}>
                    <Box className="header-section">
                        <Typography variant="h4" className="title">Staff Management</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            className="add-btn"
                            onClick={() => navigate("/staff/create")}
                        >
                            Register New Staff
                        </Button>
                    </Box>

                    <Paper elevation={3} className="list-container">
                        <Typography variant="h6" className="list-header">All Active Staff</Typography>
                        <Divider />

                        <Box className="scrollable-list">
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
                            ) : staffs.length === 0 ? (
                                <Typography align="center" sx={{ py: 10, color: '#999' }}>No staff registered yet.</Typography>
                            ) : (
                                staffs.map((s) => (
                                    <Box key={s.id} className="staff-item">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'var(--mocha-mousse)' }}><PersonIcon /></Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 'bold' }}>{s.name}</Typography>
                                                <Typography variant="caption" display="block">{s.email}</Typography>
                                                <Typography variant="caption" color="text.secondary">{s.phone}</Typography>
                                            </Box>
                                        </Stack>
                                        <Box>
                                            <IconButton onClick={() => navigate(`/staff/edit/${s.id}`)} className="action-btn edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(s.id)} className="action-btn delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Paper>

                </Container>
            </div>
        </>
    )
}