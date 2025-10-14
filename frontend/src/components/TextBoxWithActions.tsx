import * as React from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
/* import RestartAltIcon from "@mui/icons-material/RestartAlt"; */
import {
  StyledContainer,
  StyledPaper,
  StyledTitle,
  StyledTextField,
} from "../styles/TextBoxWithActions";

type TextBoxWithActionsProps = {
  value?: string;
  /* onResetACB?: () => string | void; */
  title?: string;
};

export default function TextBoxWithActions(props: TextBoxWithActionsProps) {
  const text = props.value ?? "";
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = async () => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
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
    <StyledContainer spacing={1}>
      <StyledPaper elevation={3}>
        {props.title && (
          <StyledTitle variant="subtitle2">{props.title}</StyledTitle>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
}
