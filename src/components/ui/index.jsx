import { forwardRef } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid as MuiGrid,
  InputAdornment,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
  Stack as MuiStack,
  TextField,
} from "@mui/material";
import { Search as SearchIcon } from "lucide-react";

export const Button = forwardRef(function UiButton(
  { variant = "outlined", color = "primary", ...props },
  ref,
) {
  return <MuiButton ref={ref} variant={variant} color={color} {...props} />;
});

export const Card = forwardRef(function UiCard(props, ref) {
  return <MuiCard ref={ref} {...props} />;
});

export const CardContent = forwardRef(function UiCardContent(props, ref) {
  return <MuiCardContent ref={ref} {...props} />;
});

export const Stack = forwardRef(function UiStack(
  { alignItems, alignContent, justifyContent, flexWrap, gap, sx, ...props },
  ref,
) {
  const layoutSx = Object.fromEntries(
    Object.entries({ alignItems, alignContent, justifyContent, flexWrap, gap })
      .filter(([, value]) => value !== undefined),
  );
  const sxValues = Array.isArray(sx) ? sx : [sx];

  return <MuiStack ref={ref} {...props} sx={[layoutSx, ...sxValues.filter(Boolean)]} />;
});

export const Grid = forwardRef(function UiGrid(
  { item, xs, sm, md, lg, xl, size, ...props },
  ref,
) {
  const legacySize = Object.fromEntries(
    Object.entries({ xs, sm, md, lg, xl }).filter(([, value]) => value !== undefined),
  );
  const resolvedSize = size || (Object.keys(legacySize).length ? legacySize : item ? 12 : undefined);

  return <MuiGrid ref={ref} size={resolvedSize} {...props} />;
});

export const Select = forwardRef(function UiSelect(
  { size = "small", variant = "outlined", ...props },
  ref,
) {
  return <MuiSelect ref={ref} size={size} variant={variant} {...props} />;
});

export const Autocomplete = forwardRef(function UiAutocomplete(
  { size = "small", ...props },
  ref,
) {
  return <MuiAutocomplete ref={ref} size={size} {...props} />;
});

export const Menu = forwardRef(function UiMenu(props, ref) {
  return <MuiMenu ref={ref} {...props} />;
});

export const MenuItem = forwardRef(function UiMenuItem(props, ref) {
  return <MuiMenuItem ref={ref} {...props} />;
});

export const SearchField = forwardRef(function UiSearchField(
  { slotProps, ...props },
  ref,
) {
  return (
    <TextField
      ref={ref}
      size="small"
      {...props}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment: slotProps?.input?.startAdornment || (
            <InputAdornment position="start">
              <SearchIcon size={16} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
});