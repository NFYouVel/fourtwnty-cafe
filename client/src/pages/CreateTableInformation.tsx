import '../styles/createTable.css';
import { useState } from "react";
import {
    Container, Typography, TextField, Box, Button,
    FormControl, InputLabel, Select, MenuItem, Paper, Stack
} from "@mui/material";
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';


export default function CreateTableInformation() {
    const navigate = useNavigate();

    const [formTable, setFromTable] = useState({
        table_number: '',
        seat_count: '',
        area: 'Indoor',
        status: 'Available'
    })

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/tableInformation/create", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formTable,
                    table_number: Number(formTable.table_number),
                    seat_count: Number(formTable.seat_count)
                })
            });

            if (response.ok) {
                alert("Meja berhasil dibuat");
                navigate("/tableInformation")
            } else {
                alert("Gagal create meja")
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Koneksi ke server gagal.");
        }
    };

    return (
        <div className='create-page-bg'>
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    className='back-button'>
                    Back
                </Button>

                <Paper elevation={6} className='form-container'>
                    <Typography variant="h4" className='form-title'>
                        Create Table
                    </Typography>

                    <form onSubmit={handleCreate}>
                        <Stack spacing={3} sx={{ mt: 4 }}>
                            <TextField
                                label="Table Number"
                                type="number"
                                fullWidth
                                required
                                value={formTable.table_number}
                                onChange={(e) => setFromTable({ ...formTable, table_number: e.target.value })}
                            />

                            <TextField
                                label="Kapasitas Meja"
                                type="number"
                                fullWidth
                                required
                                value={formTable.seat_count}
                                onChange={(e) => setFromTable({ ...formTable, seat_count: e.target.value })}
                            />

                            <FormControl fullWidth required>
                                <InputLabel id="area-label">Area</InputLabel>
                                <Select
                                    labelId='area-label'
                                    value={formTable.area}
                                    label="Area"
                                    onChange={(e) => setFromTable({ ...formTable, area: e.target.value })}
                                >
                                    <MenuItem value="Indoor">Indoor (AC & No Smoking)</MenuItem>
                                    <MenuItem value="Outdoor">Outdoor (Smoking Allowed)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="status-label">Status Awal</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={formTable.status}
                                    label="Status Awal"
                                    onChange={(e) => setFromTable({...formTable, status: e.target.value})}
                                >
                                    <MenuItem value="Available">Available</MenuItem>
                                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                                </Select>
                            </FormControl>

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                startIcon={<SaveIcon />}
                                className="submit-button"
                            >
                                Create Table
                            </Button>
                        </Stack>
                    </form>
                </Paper>

            </Container>
        </div>
    );
}