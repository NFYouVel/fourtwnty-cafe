import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Paper,
    CircularProgress, Divider, IconButton, Button
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import "../styles/stockPage.css";
import { useNavigate } from "react-router";
import type { Stock } from "../type/stockAttribute";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

export default function StockPage() {
    const [stocks, setStock] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchStock = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/all`);
            const data = await res.json();
            setStock(data);
        } catch (error) {
            console.error("Error fetching stock:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Yakin hapus stock ini??")) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/stock/delete/${id}`, {
                method: "DELETE"
            });
            fetchStock();
        }
    };

    const renderTableGrid = () => (
        <Box className="table-grid">
            {stocks.map((stock) => (
                <Paper
                    key={stock.id}
                    elevation={4}
                    className="table-card status-available"
                    sx={{ position: 'relative', overflow: 'hidden' }}
                >
                    <Box sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: '2px'
                    }}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/stock/update/${stock.id}`);
                            }}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.2)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' },
                                padding: '4px'
                            }}
                        >
                            <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={(e) => handleDelete(e, stock.id)}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.2)',
                                '&:hover': { bgcolor: 'rgba(255,0,0,0.4)' },
                                padding: '4px'
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    <Typography variant="h5" className="table-number">
                        {stock.ingredient_name}
                    </Typography>

                    <Typography variant="caption" className="table-sub-info">
                        Qty: {stock.amount}
                    </Typography>

                    <Typography variant="caption" className="table-sub-info">
                        Unit: {stock.unit}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="layout-page">
                <Container sx={{ py: 4 }}>
                    <Box sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        pt: 2
                    }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'var(--potting-soil)'
                            }}
                        >
                            Stock Management
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate("/stock/create")}
                            sx={{
                                bgcolor: 'var(--potting-soil)',
                                textTransform: 'none',
                                borderRadius: '8px',
                                '&:hover': {
                                    bgcolor: 'var(--spicy-coffee)'
                                }
                            }}
                        >
                            Add Stock
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 4 }}>STOCK LIST</Divider>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        renderTableGrid()
                    )}
                </Container>
            </div>
        </>
    );
}