import Calendar from "./components/Calendar";
import styled from "styled-components";
import { StyledEngineProvider } from "@mui/styled-engine-sc";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Container>
        <Calendar />
      </Container>
    </StyledEngineProvider>
  );
}

const Container = styled.div`
  background-color: white;
  color: white;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
