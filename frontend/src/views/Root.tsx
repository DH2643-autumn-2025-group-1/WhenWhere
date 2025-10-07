import styled, { css } from "styled-components";
import { AppBar } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import App from "./App.tsx";
import { Login } from "./Login.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { HomePage } from "./Homepage.tsx";

const StyledAppBar = styled(AppBar)`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 100vw;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  cursor: pointer;
  &&:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.large};
`;

const NavigationLink = styled.span<{ $active?: boolean }>`
  font-size: ${(props) => props.theme.fontSizes.large};
  cursor: pointer;

  ${(props) =>
    props.$active &&
    css`
      color: ${props.theme.colors.secondary};
      font-weight: bold;
    `};

  &&:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <StyledAppBar position="static" id="appBar">
        <Title onClick={() => navigate("/")}>WhenWhere</Title>
        <LinkContainer>
          <NavigationLink
            onClick={() => navigate("/login")}
            $active={location.pathname === "/login"}
          >
            Log in
          </NavigationLink>
        </LinkContainer>
      </StyledAppBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mark-availibility" element={<App />} />
        <Route path="/event-result" element={<div>event result</div>} />
        <Route path="/create-event" element={<EventPresenter />} />
      </Routes>
    </>
  );
}
