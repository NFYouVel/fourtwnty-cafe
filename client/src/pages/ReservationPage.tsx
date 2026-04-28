import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Box,
    ListSubheader,
    Popover
} from "@mui/material";
import { useNavigate } from "react-router";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

interface TableType {
    id: number;
    table_number: number;
    area: string;
    is_booked: boolean;
    status: string;
}

export default function ReservationPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        tanggal_reservation: new Date().toISOString().split("T")[0],
        jumlah_orang: "",
        table_number: ""
    });

    const [tables, setTables] = useState<TableType[]>([]);
    const [loading, setLoading] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `http://localhost:5000/api/tableInformation/availability?tanggal=${form.tanggal_reservation}`
                );

                const data: TableType[] = await response.json();

                if (Array.isArray(data)) {
                    setTables(data);
                }
            } catch (error) {
                console.error("Gagal load status meja:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [form.tanggal_reservation]);

    const handleWhatsappBooking = () => {
        if (!form.table_number) {
            alert("Pilih meja dulu terlebih dahulu");
            return;
        }

        const phoneNumber = "6287871123725";

        const message = `Hi, saya ingin booking meja nomor ${form.table_number} pada tanggal ${form.tanggal_reservation} untuk ${form.jumlah_orang} orang.`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/reservation/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert("Reservasi Berhasil!");
                handleWhatsappBooking();
                navigate("/home");
            } else {
                alert(result.message || "Reservasi Gagal");
            }
        } catch (error) {
            alert("Terjadi kesalahan koneksi: " + error);
        }
    };

    const indoorTables = tables.filter((t) => t.area === "Indoor");
    const outdoorTables = tables.filter((t) => t.area === "Outdoor");

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectTable = (tableNumber: string) => {
        setForm({ ...form, table_number: tableNumber });
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? "table-popover" : undefined;

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <HeaderDashboard />

            <Container maxWidth="sm" sx={{ py: 10 }}>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        borderTop: "8px solid var(--potting-soil)"
                    }}
                >
                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <CalendarMonthIcon
                            sx={{
                                fontSize: 40,
                                color: "var(--potting-soil)"
                            }}
                        />

                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold" }}
                        >
                            Book a Table
                        </Typography>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Tanggal Reservasi"
                                type="date"
                                fullWidth
                                required
                                slotProps={{
                                    inputLabel: { shrink: true }
                                }}
                                value={form.tanggal_reservation}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tanggal_reservation: e.target.value
                                    })
                                }
                            />

                            <TextField
                                label="Jumlah Orang"
                                type="number"
                                fullWidth
                                required
                                value={form.jumlah_orang}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        jumlah_orang: e.target.value
                                    })
                                }
                            />

                            <Box
                                onClick={handleClick}
                                sx={{ cursor: "pointer" }}
                            >
                                <TextField
                                    label="Pilih Nomor Meja"
                                    fullWidth
                                    required
                                    value={
                                        form.table_number
                                            ? `Meja #${form.table_number}`
                                            : ""
                                    }
                                    placeholder="Klik untuk memilih meja"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            sx: {
                                                pointerEvents: "none"
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center"
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center"
                                }}
                                PaperProps={{
                                    sx: {
                                        maxWidth: "100%",
                                        maxHeight: 320,
                                        borderRadius: 3,
                                        p: 2,
                                        mt: 2,
                                        overflowY: "auto"
                                    }
                                }}
                            >
                                <ListSubheader
                                    sx={{
                                        fontWeight: "bold",
                                        bgcolor: "#f5f5f5",
                                        textAlign: "center",
                                        borderRadius: 1,
                                        mb: 2,
                                        lineHeight: "40px"
                                    }}
                                >
                                    INDOOR AREA
                                </ListSubheader>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        mb: 4,
                                        justifyContent: "center",
                                        maxWidth: 300,
                                        margin: "0 auto"
                                    }}
                                >
                                    {indoorTables.map((table) => {
                                        const isLocked =
                                            table.is_booked ||
                                            table.status === "Unavailable";

                                        const isSelected =
                                            form.table_number ===
                                            String(table.table_number);

                                        return (
                                            <Button
                                                key={table.id}
                                                variant="contained"
                                                disabled={isLocked}
                                                onClick={() =>
                                                    handleSelectTable(
                                                        String(
                                                            table.table_number
                                                        )
                                                    )
                                                }
                                                sx={{
                                                    width: "60px",
                                                    height: "60px",
                                                    minWidth: "60px",
                                                    borderRadius: 2,
                                                    fontSize: "1rem",
                                                    fontWeight: "bold",
                                                    p: 0,
                                                    bgcolor: isSelected
                                                        ? "var(--potting-soil)"
                                                        : "var(--mocha-mousse)",
                                                    color: "white"
                                                }}
                                            >
                                                #{table.table_number}
                                            </Button>
                                        );
                                    })}
                                </Box>

                                <ListSubheader
                                    sx={{
                                        fontWeight: "bold",
                                        bgcolor: "#f5f5f5",
                                        textAlign: "center",
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                >
                                    🌿 OUTDOOR AREA
                                </ListSubheader>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        justifyContent: "center",
                                        maxWidth: 300,
                                        margin: "0 auto"
                                    }}
                                >
                                    {outdoorTables.map((table) => {
                                        const isLocked =
                                            table.is_booked ||
                                            table.status === "Unavailable";

                                        const isSelected =
                                            form.table_number ===
                                            String(table.table_number);

                                        return (
                                            <Button
                                                key={table.id}
                                                variant="contained"
                                                disabled={isLocked}
                                                onClick={() =>
                                                    handleSelectTable(
                                                        String(
                                                            table.table_number
                                                        )
                                                    )
                                                }
                                                sx={{
                                                    width: "60px",
                                                    height: "60px",
                                                    minWidth: "60px",
                                                    borderRadius: 2,
                                                    fontSize: "1rem",
                                                    fontWeight: "bold",
                                                    p: 0,
                                                    bgcolor: isSelected
                                                        ? "var(--potting-soil)"
                                                        : "var(--mocha-mousse)",
                                                    color: "white"
                                                }}
                                            >
                                                #{table.table_number}
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Popover>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: "var(--potting-soil)",
                                    py: 1.5
                                }}
                            >
                                Confirm Reservation
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
