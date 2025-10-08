import styled from "styled-components";
import { Button } from "@mui/material";

export function ButtonComponent({
  text,
  disabled,
  onClickFunction,
  variant,
  style,
}: {
  text: string;
  disabled?: boolean;
  onClickFunction: () => void;
  variant?: "outlined" | "primary";
  style?: React.CSSProperties;
}) {
  return (
    <StyledButton
      variant="outlined"
      fullWidth
      onClick={onClickFunction}
      disabled={disabled}
      $primary={variant === "primary"}
      style={style}
    >
      {text}
    </StyledButton>
  );
}

const StyledButton = styled(Button)<{ disabled?: boolean; $primary?: boolean }>`
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.secondary
      : props.$primary
        ? props.theme.colors.primary
        : `white`};
  color: ${(props) => (props.$primary ? `white` : props.theme.colors.primary)};

  &&:hover {
    background-color: ${(props) => (props.$primary ? `#73a9e8` : `#1976d20a`)};
  }
`;
