import * as React from "react";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
/* import RestartAltIcon from "@mui/icons-material/RestartAlt"; */
import styled from "styled-components";
import { Card } from "./StyledComponents";
import { styled as muiStyled } from "@mui/material/styles";

type TextBoxWithActionsProps = {
  value?: string;
  /* onResetACB?: () => string | void; */
  title?: string;
};

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1;
  width: 100%;
`;

const StyledCard = styled(Card)`
  width: 100%;
  gap: ${(props) => props.theme.spacing.small};
  align-items: flex-start;
`;

const StyledTitle = styled(Typography)`
  font-weight: 500;
  color: #2c3e50;
  align-self: center;
  text-align: center;
`;

const StyledTextField = muiStyled(TextField)(() => ({
  "& .MuiInputBase-input": {
    textAlign: "center",
    minWidth: "4ch",
  },
}));

export default function TextBoxWithActions(props: TextBoxWithActionsProps) {
  const text = props.value ?? "";
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = async () => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Error handled silently
    }
  };

  /*   const handleReset = () => {
    if (props.onResetACB) {
      const newVal = props.onResetACB();
      if (typeof newVal === "string") setText(newVal);
    } else {
      setText(props.value);
    }
  }; */

  return (
    <StyledCard>
      {props.title && (
        <StyledTitle variant="subtitle2">{props.title}</StyledTitle>
      )}

      <StyledBox>
        <StyledTextField
          variant="outlined"
          value={text}
          size="small"
          disabled
          sx={{
            "& .MuiInputBase-input": {
              width: `${text.length}ch`,
            },
          }}
        />

        <Stack direction="row" spacing={0.5}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton
              color={copied ? "success" : "primary"}
              onClick={handleCopy}
              size="small"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {/**
            <Tooltip title="Reset">
              <IconButton color="secondary" onClick={handleReset} size="small">
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            */}
        </Stack>
      </StyledBox>
    </StyledCard>
  );
}
