import '../styles/stockForm.css';
import { useState, useEffect } from "react";
import {
    Container, Typography, TextField, Button,
    Paper, Stack
} from "@mui/material";
import { useNavigate, useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import type { Stock } from '../type/stockAttribute';
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

export default function StockForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;

    const [formStock, setFormStock] = useState({
        ingredient_name: '',
        amount: ''
    });

    useEffect(() => {
        const fetchStock = async () => {
            if (!isEdit) {
                return;
            }
            try {
                const res = await fetch("http://localhost:5000/api/stock/all");
                const data = await res.json();
                const found = data.find((s: Stock) => s.id === id);
                if (found) {
                    setFormStock({
                        ingredient_name: found.ingredient_name,
                        amount: found.amount.toString()
                    });
                }
            } catch (error) {
                console.error("Error fetching stock:", error);
                alert("Gagal mengambil data stock.");
            }
        };

        fetchStock();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                isEdit
                    ? `http://localhost:5000/api/stock/update/${id}`
                    : `http://localhost:5000/api/stock/create`,
                {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ingredient_name: formStock.ingredient_name,
                        amount: Number(formStock.amount)
                    })
                }
            );

            if (response.ok) {
                alert(isEdit ? "Stock berhasil diupdate" : "Stock berhasil dibuat");
                navigate("/stock");
            } else {
                alert("Gagal menyimpan stock");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Koneksi ke server gagal.");
        }
    };

    return (

        <>
            <Header />
            <HeaderDashboard />

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
                            {isEdit ? "Update Stock" : "Create Stock"}
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3} sx={{ mt: 4 }}>

                                <TextField
                                    label="Ingredient Name"
                                    fullWidth
                                    required
                                    value={formStock.ingredient_name}
                                    onChange={(e) =>
                                        setFormStock({
                                            ...formStock,
                                            ingredient_name: e.target.value
                                        })
                                    }
                                />

                                <TextField
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    required
                                    value={formStock.amount}
                                    onChange={(e) =>
                                        setFormStock({
                                            ...formStock,
                                            amount: e.target.value
                                        })
                                    }
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    className="submit-button"
                                >
                                    {isEdit ? "Update Stock" : "Create Stock"}
                                </Button>

                            </Stack>
                        </form>
                    </Paper>
                </Container>
            </div>
        </>
    );
}