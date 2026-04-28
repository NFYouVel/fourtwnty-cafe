import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Stack,
    Box,
    Chip,
    CircularProgress,
    Button,
    Divider
} from "@mui/material";
import type { ChipProps } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChairIcon from "@mui/icons-material/Chair";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";

interface TableInformationType {
    table_number: number;
    area: string;
}

interface ReservationType {
    id: string;
    tanggal_reservation: string;
    jumlah_orang: number;
    status_reservation: string;
    tableInformation?: TableInformationType;
}

interface ApiResponseType {
    status: string;
    data: ReservationType[];
}

export default function ShowReservationCustomer() {
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReservations = async () => {
            const token = localStorage.getItem("token");
            const userId = JSON.parse(
                localStorage.getItem("userData") || "{}"
            ).id;

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/reservation/myReservation/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const result: ApiResponseType = await response.json();

                if (result.status === "Success") {
                    setReservations(result.data);
                }
            } catch (error) {
                console.error("Gagal load reservasi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReservations();
    }, []);

    const getStatusColor = (
        status: string
    ): ChipProps["color"] => {
        switch (status) {
            case "Approved":
                return "success";
            case "Pending":
                return "warning";
            case "Reschedule":
                return "info";
            case "Rejected":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <>
            <Header />
            <HeaderDashboard />

            <Container maxWidth="md" sx={{ py: 10 }}>
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            color: "var(--potting-soil)"
                        }}
                    >
                        My Table Bookings
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Cek status meja Fourtwnty Cafe anda di sini.
                    </Typography>
                </Stack>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 10
                        }}
                    >
                        <CircularProgress
                            sx={{
                                color: "var(--potting-soil)"
                            }}
                        />
                    </Box>
                ) : reservations.length === 0 ? (
                    <Paper
                        sx={{
                            p: 5,
                            textAlign: "center",
                            borderRadius: 4
                        }}
                    >
                        <Typography>
                            Belum ada reservasi. Silahkan booking meja terlebih dulu!
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={3}>
                        {reservations.map((res) => (
                            <Paper
                                key={res.id}
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    borderLeft:
                                        "10px solid var(--mocha-mousse)",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.02)"
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "flex-start",
                                        flexWrap: "wrap",
                                        gap: 2
                                    }}
                                >
                                    <Stack spacing={1}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: 1
                                            }}
                                        >
                                            <CalendarMonthIcon
                                                sx={{
                                                    color: "var(--potting-soil)"
                                                }}
                                            />

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                {new Date(
                                                    res.tanggal_reservation
                                                ).toLocaleDateString(
                                                    "id-ID",
                                                    {
                                                        weekday:
                                                            "long",
                                                        year: "numeric",
                                                        month:
                                                            "long",
                                                        day: "numeric"
                                                    }
                                                )}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: 1
                                            }}
                                        >
                                            <ChairIcon
                                                sx={{
                                                    color: "var(--pepper-rice)"
                                                }}
                                            />

                                            <Typography variant="body1">
                                                Meja{" "}
                                                <strong>
                                                    #
                                                    {
                                                        res
                                                            .tableInformation
                                                            ?.table_number
                                                    }
                                                </strong>{" "}
                                                (
                                                {
                                                    res
                                                        .tableInformation
                                                        ?.area
                                                }
                                                ) •{" "}
                                                {
                                                    res.jumlah_orang
                                                }{" "}
                                                Orang
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack
                                        alignItems="flex-end"
                                        spacing={1}
                                    >
                                        <Chip
                                            label={
                                                res.status_reservation
                                            }
                                            color={getStatusColor(
                                                res.status_reservation
                                            )}
                                            sx={{
                                                fontWeight:
                                                    "bold",
                                                px: 2
                                            }}
                                        />

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            ID:{" "}
                                            {res.id.substring(
                                                0,
                                                8
                                            )}
                                            ...
                                        </Typography>
                                    </Stack>
                                </Box>

                                {res.status_reservation ===
                                    "Pending" && (
                                    <>
                                        <Divider
                                            sx={{
                                                my: 2
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "flex-end",
                                                gap: 2
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="inherit"
                                                sx={{
                                                    textTransform:
                                                        "none"
                                                }}
                                            >
                                                Request
                                                Reschedule
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>
        </>
    );
}
