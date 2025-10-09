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
  variant?: "outlined" | "primary" | "negative";
  style?: React.CSSProperties;
}) {
  return (
    <StyledButton
      variant="outlined"
      onClick={onClickFunction}
      disabled={disabled}
      $primary={variant === "primary"}
      negative={variant === "negative"}
      style={style}
    >
      {text}
    </StyledButton>
  );
}

const StyledButton = styled(Button)<{
  disabled?: boolean;
  $primary?: boolean;
  negative?: boolean;
}>`
  display: inline-flex;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.secondary
      : props.$primary
        ? props.theme.colors.primary
        : props.negative
          ? `white`
          : `white`};
  color: ${(props) =>
    props.$primary
      ? `white`
      : props.negative
        ? `#d32f2f`
        : props.theme.colors.primary};

  &&:hover {
    background-color: ${(props) =>
      props.$primary
        ? `#73a9e8`
        : props.negative
          ? `#f8d7da`
          : props.theme.colors.secondary};
  }
`;
