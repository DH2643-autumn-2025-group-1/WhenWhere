import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export function LoadingView() {
  return (
    <LoadingContainer>
      <CircularProgress />
    </LoadingContainer>
  );
}
