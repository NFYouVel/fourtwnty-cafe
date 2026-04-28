import { useEffect, useState } from "react";
import WeekendIcon from "@mui/icons-material/Weekend";
import DeckIcon from "@mui/icons-material/Deck";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Stack,
    CircularProgress,
    Divider,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    type SelectChangeEvent
} from "@mui/material";

import { useNavigate } from "react-router";
import Header from "../components/Header";
import HeaderDashboard from "../components/HeaderDashboard";
import "../styles/tableInformation.css";

type TableInformation = {
    id: string;
    table_number: number;
    seat_count: number;
    area: "Indoor" | "Outdoor";
    status: "Available" | "Unavailable";
    is_booked?: boolean;
};

export default function TableInformationPage() {
    const navigate = useNavigate();

    const [tables, setTables] = useState<TableInformation[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] =
        useState<TableInformation | null>(null);

    const [loading, setLoading] =
        useState<boolean>(false);

    const fetchTables = async (
        date: string
    ) => {
        setLoading(true);
        setTables([]);

        try {
            const response = await fetch(
                `/api/tableInformation/availability?tanggal=${date}`
            );

            const data: TableInformation[] =
                await response.json();

            if (Array.isArray(data)) {
                setTables(data);
            } else {
                setTables([]);
            }
        } catch (error) {
            console.error(
                "Koneksi ke Backend gagal:",
                error
            );
            setTables([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables(selectedDate);
    }, [selectedDate]);

    const handleTable = (
        table: TableInformation
    ) => {
        if (
            table.is_booked ||
            table.status === "Unavailable"
        ) {
            alert("Meja sudah penuh");
            return;
        }
    };

    const handleDelete = async (
        e: React.MouseEvent,
        table: TableInformation
    ) => {
        e.stopPropagation();

        if (
            table.status ===
            "Unavailable"
        ) {
            alert(
                "Meja berstatus Unavailable tidak boleh dihapus!"
            );
            return;
        }

        if (
            window.confirm(
                "Yakin ingin menghapus meja ini?"
            )
        ) {
            try {
                await fetch(
                    `/api/tableInformation/${table.id}`,
                    {
                        method: "DELETE"
                    }
                );

                fetchTables(
                    selectedDate
                );
            } catch (error) {
                alert(
                    "Gagal menghapus: " +
                    error
                );
            }
        }
    };

    const handleEdit = (
        e: React.MouseEvent,
        table: TableInformation
    ) => {
        e.stopPropagation();
        setEditData(table);
        setOpenEdit(true);
    };

    const handleEditStatus =
        async () => {
            if (!editData) return;

            try {
                const response =
                    await fetch(
                        `/api/tableInformation/${editData.id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify(
                                {
                                    status:
                                        editData.status
                                }
                            )
                        }
                    );

                if (
                    response.ok
                ) {
                    setOpenEdit(
                        false
                    );

                    fetchTables(
                        selectedDate
                    );
                }
            } catch (error) {
                alert(
                    "Gagal Update status: " +
                    error
                );
            }
        };

    const handleStatusChange = (
        e: SelectChangeEvent
    ) => {
        const value =
            e.target
                .value as TableInformation["status"];

        setEditData((prev) =>
            prev
                ? {
                    ...prev,
                    status: value
                }
                : null
        );
    };

    const renderTableGrid = (
        areaName:
            | "Indoor"
            | "Outdoor"
    ) => (
        <Box className="table-grid">
            {tables
                .filter(
                    (t) =>
                        t.area ===
                        areaName
                )
                .map((table) => {
                    const isNotAvailable =
                        table.is_booked ||
                        table.status ===
                        "Unavailable";

                    const statusClass =
                        isNotAvailable
                            ? "status-booked"
                            : "status-available";

                    return (
                        <Paper
                            key={
                                table.id
                            }
                            elevation={
                                table.is_booked
                                    ? 0
                                    : 4
                            }
                            className={`table-card ${statusClass}`}
                            onClick={() =>
                                handleTable(
                                    table
                                )
                            }
                            sx={{
                                position:
                                    "relative",
                                overflow:
                                    "hidden"
                            }}
                        >
                            <Box
                                sx={{
                                    position:
                                        "absolute",
                                    top: 5,
                                    right: 5,
                                    display:
                                        "flex"
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={(
                                        e
                                    ) =>
                                        handleEdit(
                                            e,
                                            table
                                        )
                                    }
                                    sx={{
                                        color: "white"
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    size="small"
                                    onClick={(
                                        e
                                    ) =>
                                        handleDelete(
                                            e,
                                            table
                                        )
                                    }
                                    disabled={
                                        table.status ===
                                        "Unavailable"
                                    }
                                    sx={{
                                        color: "white",
                                        "&.Mui-disabled":
                                        {
                                            color: "rgba(255,255,255,0.3)"
                                        }
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Typography
                                variant="h5"
                                className="table-number"
                            >
                                #
                                {
                                    table.table_number
                                }
                            </Typography>

                            <Typography
                                variant="caption"
                                className="table-sub-info"
                            >
                                Seats:{" "}
                                {
                                    table.seat_count
                                }
                            </Typography>
                        </Paper>
                    );
                })}
        </Box>
    );

    return (
        <>
            <Header />
            <HeaderDashboard />

            <div className="layout-page">
                <Container
                    sx={{ py: 4 }}
                >
                    <Box
                        sx={{
                            position:
                                "relative",
                            mb: 6,
                            display:
                                "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center"
                        }}
                    >
                        <Typography
                            variant="h4"
                            className="page-title"
                            sx={{
                                fontWeight:
                                    "bold",
                                textAlign:
                                    "center",
                                color: "var(--dry-creek)"
                            }}
                        >
                            Fourtwnty
                            Cafe Table
                            Information
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={() =>
                                navigate(
                                    "/tableInformation/create"
                                )
                            }
                            sx={{
                                position:
                                    "absolute",
                                right: 0,
                                bgcolor:
                                    "var(--potting-soil)",
                                textTransform:
                                    "none",
                                borderRadius:
                                    "8px"
                            }}
                        >
                            Add Table
                        </Button>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            display:
                                "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            gap: 3,
                            mb: 4,
                            p: 2,
                            bgcolor:
                                "rgba(0,0,0,0.03)",
                            borderRadius:
                                "12px"
                        }}
                    >
                        <Box
                            sx={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 2
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight:
                                        "bold"
                                }}
                            >
                                VIEW
                                DATE:
                            </Typography>

                            <TextField
                                type="date"
                                size="small"
                                value={
                                    selectedDate
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSelectedDate(
                                        e
                                            .target
                                            .value
                                    )
                                }
                            />
                        </Box>

                        <Divider
                            orientation="vertical"
                            flexItem
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                        >
                            <Chip
                                label="Available"
                                size="small"
                            />

                            <Chip
                                label="Unavailable"
                                size="small"
                            />
                        </Stack>
                    </Paper>

                    {loading ? (
                        <Box
                            sx={{
                                display:
                                    "flex",
                                justifyContent:
                                    "center"
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Divider
                                sx={{
                                    mb: 4
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={
                                        1
                                    }
                                >
                                    <WeekendIcon />
                                    <Typography>
                                        INDOOR
                                        AREA
                                    </Typography>
                                </Stack>
                            </Divider>

                            {renderTableGrid(
                                "Indoor"
                            )}

                            <Divider
                                sx={{
                                    mt: 6,
                                    mb: 4
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={
                                        1
                                    }
                                >
                                    <DeckIcon />
                                    <Typography>
                                        OUTDOOR
                                        AREA
                                    </Typography>
                                </Stack>
                            </Divider>

                            {renderTableGrid(
                                "Outdoor"
                            )}
                        </>
                    )}

                    <Dialog
                        open={
                            openEdit
                        }
                        onClose={() =>
                            setOpenEdit(
                                false
                            )
                        }
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>
                            Edit Table #
                            {
                                editData?.table_number
                            }
                        </DialogTitle>

                        <DialogContent>
                            <Box
                                sx={{
                                    mt: 2
                                }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel>
                                        Status
                                        Meja
                                    </InputLabel>

                                    <Select
                                        value={
                                            editData?.status ||
                                            ""
                                        }
                                        label="Status Meja"
                                        onChange={
                                            handleStatusChange
                                        }
                                    >
                                        <MenuItem value="Available">
                                            Available
                                        </MenuItem>

                                        <MenuItem value="Unavailable">
                                            Unavailable
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>

                        <DialogActions
                            sx={{
                                p: 3
                            }}
                        >
                            <Button
                                onClick={() =>
                                    setOpenEdit(
                                        false
                                    )
                                }
                            >
                                Batal
                            </Button>

                            <Button
                                variant="contained"
                                onClick={
                                    handleEditStatus
                                }
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        </>
    );
}
