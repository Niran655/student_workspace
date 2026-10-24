import { useState } from "react";
import { Box, Button, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2020, month, 1))
);

export const parseDateValue = (value) => {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

export const toDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function DatePickerCalendar({
    value,
    onChange,
    onClose,
    onClear,
    isDark = true,
    theme,
    minDate,
    maxDate,
}) {
    const selected = parseDateValue(value);
    const now = new Date();
    const [view, setView] = useState(() => {
        const initial = selected || now;
        return new Date(initial.getFullYear(), initial.getMonth(), 1);
    });
    const year = view.getFullYear();
    const month = view.getMonth();
    const palette = {
        text: isDark ? "#e4e4e7" : "#1f2937",
        muted: isDark ? "#9ca3af" : "#6b7280",
        hover: isDark ? "#303239" : "#f3f4f6",
        surface: isDark ? "#1c1e22" : "#ffffff",
        border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
        accent: isDark ? "#2796d2" : "#1976d2",
        ...theme,
    };
    const years = Array.from({ length: 31 }, (_, index) => now.getFullYear() - 15 + index);
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);
    const days = Array.from({ length: 42 }, (_, index) =>
        new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index)
    );
    const sameDay = (a, b) =>
        Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
    const isDisabled = (date) => {
        const min = parseDateValue(minDate);
        const max = parseDateValue(maxDate);
        const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return (min && day < min) || (max && day > max);
    };

    const selectSx = {
        color: palette.text,
        fontWeight: 700,
        fontSize: "1rem",
        "& .MuiOutlinedInput-notchedOutline": { border: 0 },
        "& .MuiSelect-select": { py: 0.5, pl: 0.75, pr: "24px !important" },
        "& .MuiSvgIcon-root": { color: palette.muted },
    };

    return (
        <Box sx={{ width: 340, maxWidth: "calc(100vw - 32px)", p: 1.5, bgcolor: palette.surface, color: palette.text }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Select
                        size="small"
                        value={month}
                        onChange={(event) => setView(new Date(year, Number(event.target.value), 1))}
                        sx={selectSx}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 320, bgcolor: palette.surface, color: palette.text } } }}
                    >
                        {MONTHS.map((label, index) => <MenuItem key={label} value={index}>{label}</MenuItem>)}
                    </Select>
                    <Select
                        size="small"
                        value={year}
                        onChange={(event) => setView(new Date(Number(event.target.value), month, 1))}
                        sx={selectSx}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 320, bgcolor: palette.surface, color: palette.text } } }}
                    >
                        {years.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                    </Select>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <IconButton size="small" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))} sx={{ color: palette.muted }}>
                        <ChevronLeft size={18} />
                    </IconButton>
                    <IconButton size="small" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))} sx={{ color: palette.muted }}>
                        <ChevronRight size={18} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.75 }}>
                {WEEKDAYS.map((weekday) => (
                    <Typography key={weekday} sx={{ textAlign: "center", color: palette.muted, fontSize: "0.75rem", fontWeight: 600 }}>
                        {weekday}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                {days.map((date) => {
                    const inMonth = date.getMonth() === month;
                    const isSelected = sameDay(date, selected);
                    const isToday = sameDay(date, now);
                    const disabled = isDisabled(date);
                    return (
                        <Button
                            key={toDateValue(date)}
                            disabled={disabled}
                            aria-label={date.toLocaleDateString()}
                            onClick={() => {
                                onChange(toDateValue(date));
                                onClose?.();
                            }}
                            sx={{
                                minWidth: 0,
                                width: "100%",
                                aspectRatio: "1",
                                p: 0,
                                borderRadius: "50%",
                                color: isSelected ? "#fff" : inMonth ? palette.text : palette.muted,
                                bgcolor: isSelected ? palette.accent : "transparent",
                                fontSize: "0.875rem",
                                fontWeight: isSelected || isToday ? 700 : 500,
                                border: isToday && !isSelected ? `1px solid ${palette.accent}` : "1px solid transparent",
                                "&:hover": { bgcolor: isSelected ? palette.accent : palette.hover },
                                "&.Mui-disabled": { color: palette.muted, opacity: 0.35 },
                            }}
                        >
                            {date.getDate()}
                        </Button>
                    );
                })}
            </Box>

            {(onClear || onClose) && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, pt: 0.75, borderTop: `1px solid ${palette.border}` }}>
                    <Button
                        size="small"
                        onClick={() => {
                            onChange(toDateValue(now));
                            onClose?.();
                        }}
                        sx={{ color: palette.accent, textTransform: "none", minWidth: 0 }}
                    >
                        Today
                    </Button>
                    {onClear ? (
                        <Button size="small" onClick={onClear} sx={{ color: palette.muted, textTransform: "none", minWidth: 0 }}>
                            Clear
                        </Button>
                    ) : (
                        <Button size="small" onClick={onClose} sx={{ color: palette.muted, textTransform: "none", minWidth: 0 }}>
                            Close
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
