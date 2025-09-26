import { Button } from "@mui/material";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <Button variant="contained">Hello World</Button>
    </Container>
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
