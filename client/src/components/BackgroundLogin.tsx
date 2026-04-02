import { Box } from "@mui/material";
import bgImage from "../assets/Coffee Background.jpg";

export default function BackgroundLogin() {
    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.4)",
                }}
            />
        </Box>
    );
}
