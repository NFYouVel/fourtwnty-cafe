import { useEffect, useState } from "react";
import { 
    Container, Typography, TextField, Button, 
    Paper, Stack, Box, CircularProgress 
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditStaffPage(){
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffDetail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/staff/${id}`);
                const result = await response.json();

                if(result.status === "Success"){
                    setForm({
                        name: result.data.name,
                        email: result.data.email,
                        phone: result.data.phone
                    })
                }
            } catch (error) {
                console.error("Gagal ambil detail staff:", error);
                alert("Data staff tidak ditemukan");
                navigate("/staff");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffDetail();
    }, [id, navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                alert("Data staff berhasil di-update!");
                navigate("/staff");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Gagal mengupdate data");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate("/staff")} 
                sx={{ mb: 2, color: 'var(--potting-soil)', textTransform: 'none' }}
            >
                Back to Staff List
            </Button>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--potting-soil)' }}>
                    Edit Staff Profile
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                    Update informasi staff dengan ID: {id?.substring(0, 8)}...
                </Typography>

                <form onSubmit={handleUpdate}>
                    <Stack spacing={3}>
                        <TextField 
                            label="Full Name" 
                            fullWidth 
                            required 
                            value={form.name} 
                            onChange={(e) => setForm({...form, name: e.target.value})} 
                        />

                        <TextField 
                            label="Email Address" 
                            type="email" 
                            fullWidth 
                            required 
                            value={form.email} 
                            onChange={(e) => setForm({...form, email: e.target.value})} 
                        />

                        <TextField 
                            label="Phone Number" 
                            fullWidth 
                            required 
                            value={form.phone} 
                            onChange={(e) => setForm({...form, phone: e.target.value})} 
                        />

                        <Box sx={{ mt: 2 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                startIcon={<SaveIcon />}
                                sx={{ 
                                    bgcolor: 'var(--potting-soil)', 
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: 'var(--pepper-rice)' }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Container>
    )
}