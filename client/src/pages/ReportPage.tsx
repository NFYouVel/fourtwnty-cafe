import { useState } from "react";
import {
    Container, Typography, Box, Paper, Button,
    Chip, Divider, CircularProgress, TextField
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Stack from "@mui/material/Stack";

import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

type Report = {
    totalOrders: number;
    totalRevenue: number;
    dineIn: number;
    takeaway: number;
    closed: number;
    cancelled: number;
};

export default function StaffReportPage() {
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        if (!startDate || !endDate) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `/api/report?start=${startDate}&end=${endDate}`
            );
            const data = await res.json();
            setReport(data);
        } catch (err) {
            console.error("Gagal ambil report:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <HeaderDashboard />

            <Box sx={{ minHeight: '100vh', bgcolor: 'var(--froth)', py: 6 }}>
                <Container maxWidth="md">

                    {/* TITLE */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
                        <Box sx={{ bgcolor: 'var(--potting-soil)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <CalendarMonthIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--potting-soil)' }}>
                            Daily Report
                        </Typography>
                    </Stack>

                    {/* DATE FILTER */}
                    <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
                        <TextField
                            type="date"
                            label="Start Date"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            fullWidth
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={fetchReport}
                            sx={{ bgcolor: 'var(--potting-soil)', px: 4 }}
                        >
                            Generate
                        </Button>
                    </Stack>

                    {/* LOADING */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress sx={{ color: 'var(--potting-soil)' }} />
                        </Box>
                    ) : !report ? (
                        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.5)', border: '2px dashed #ccc' }}>
                            <Typography sx={{ color: '#999', fontStyle: 'italic' }}>
                                Select date range to generate report.
                            </Typography>
                        </Paper>
                    ) : (
                        <Box>

                            {/* DATE HEADER */}
                            <Divider textAlign="left" sx={{ mb: 3 }}>
                                <Chip
                                    icon={<CalendarMonthIcon style={{ color: 'white' }} />}
                                    label={`${startDate} → ${endDate}`}
                                    sx={{
                                        bgcolor: 'var(--mocha-mousse)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        py: 2,
                                        px: 1,
                                        borderRadius: 2
                                    }}
                                />
                            </Divider>

                            {/* CARD */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    borderLeft: `8px solid var(--potting-soil)`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--potting-soil)' }}>
                                    Report Summary
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Typography>
                                        Total Orders: <strong>{report.totalOrders}</strong>
                                    </Typography>

                                    <Typography>
                                        Total Revenue: <strong>Rp {report.totalRevenue}</strong>
                                    </Typography>

                                    <Typography>
                                        Dine-in: <strong>{report.dineIn}</strong> | Takeaway: <strong>{report.takeaway}</strong>
                                    </Typography>

                                    <Typography>
                                        Closed: <strong>{report.closed}</strong> | Cancelled: <strong>{report.cancelled}</strong>
                                    </Typography>
                                </Stack>
                            </Paper>

                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
}