import { Button } from "@mui/material";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import styled from "styled-components";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Container>
        <Button variant="contained">Hello World</Button>
      </Container>
    </StyledEngineProvider>
  );
}

const Container = styled.div`
  background-color: blue;
  color: white;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
