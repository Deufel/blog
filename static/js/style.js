const $btn = {
  // Base styles + elevated variant
  background:
    "light-dark(color-mix(in oklch, var(--gray-2) 97%, var(--color-16)), color-mix(in oklch, var(--gray-13) 97%, var(--color-1)))",
  color: "var(--color-8)",
  borderRadius: "var(--button-border-radius)",
  border: "var(--border-size-1) solid transparent",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  gap: "var(--size-2)",
  minBlockSize: "2.375rem",
  paddingBlock: "0.5ex",
  paddingInline: "1.5ex",
  textAlign: "center",
  textDecoration: "none",
  userSelect: "none",
  boxShadow:
    "0px 3px 1px -2px oklch(0 0 0 / 20%), 0px 2px 2px 0px oklch(0 0 0 / 14%), 0px 1px 5px 0px oklch(0 0 0 / 12%)",
  transition:
    "background-color 0.2s var(--ease-out-3), box-shadow 0.2s var(--ease-out-3)",
};
