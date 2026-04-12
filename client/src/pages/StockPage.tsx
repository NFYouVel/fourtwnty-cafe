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

export default function StockPage() {
    const [stocks, setStock] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchStock = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/stock/all");
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
            await fetch(`http://localhost:5000/api/stock/delete/${id}`, {
                method: "DELETE"
            });
            fetchStock();
        }
    };

    const renderTableGrid = () => (
        <Box className='table-grid'>
            {stocks.map((stock) => (
                <Paper
                    key={stock.id}
                    elevation={4}
                    className={`table-card status-available`}
                    sx={{ position: 'relative', overflow: 'hidden' }}
                >
                    <Box sx={{ position: "absolute", top: 5, right: 5, display: 'flex' }}>
                        <IconButton
                            size='small'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/stock/update/${stock.id}`);
                            }}
                            sx={{ color: 'white' }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size='small'
                            onClick={(e) => handleDelete(e, stock.id)}
                            sx={{ color: 'white' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Typography variant='h5' className='table-number'>
                        {stock.ingredient_name}
                    </Typography>

                    <Typography variant='caption' className='table-sub-info'>
                        Qty: {stock.amount}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );

    return (
        <div className='layout-page'>
            <Container sx={{ py: 4 }}>

                {/* TITLE (SAMA KAYA TEMEN LU) */}
                <Box sx={{ position: 'relative', mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography
                        variant='h4'
                        className='page-title'
                        sx={{ fontWeight: 'bold', textAlign: 'center', color: 'var(--potting-soil)' }}
                    >
                        Stock Management
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/stock/create")}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            bgcolor: 'var(--potting-soil)',
                            textTransform: 'none',
                            borderRadius: '8px'
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
    );
}