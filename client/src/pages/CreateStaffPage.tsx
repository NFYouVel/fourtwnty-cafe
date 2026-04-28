import { useState } from "react";
import { Container, Typography, TextField, Button, Paper, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

export default function CreateStaffPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/staff/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        }
    );

    if (response.ok) {
        alert("Staff berhasil didaftarkan!");
        navigate("/staff");
    }
};


    return (
        <>
            <Header />
            <HeaderDashboard />
            <Box sx={{
                minHeight: "100vh",
                bgcolor: "#fdf8f5",
                py: 10
            }}>
                <Container maxWidth="sm" sx={{ py: 10 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'var(--potting-soil)' }}>Back</Button>
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Register New Staff</Typography>
                        <form onSubmit={handleCreate}>
                            <Stack spacing={3}>
                                <TextField label="Full Name" fullWidth required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                <TextField label="Email Address" type="email" fullWidth required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                <TextField label="Phone Number" fullWidth required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                <TextField label="Password" type="password" fullWidth required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                                <Button type="submit" variant="contained" size="large" sx={{ bgcolor: 'var(--potting-soil)' }}>Register Staff</Button>
                            </Stack>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </>
    )

}