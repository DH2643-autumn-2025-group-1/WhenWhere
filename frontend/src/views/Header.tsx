import { styled } from "styled-components";
import { AppBar } from "@mui/material";
import { ButtonComponent } from "../components/Button";
import { useLocation } from "react-router";

interface HeaderViewProps {
  isAuthenticated: boolean;
  onTitleClick: () => void;
  onAuthButtonClick: () => void;
  onCreateEventClick: () => void;
}

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

/**
import { css } from "styled-components";

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
*/

export function HeaderView({
  isAuthenticated,
  onTitleClick,
  onAuthButtonClick,
  onCreateEventClick,
}: HeaderViewProps) {
  const location = useLocation();
  const isSignInRoute = location.pathname === "/sign-in";
  return (
    <StyledAppBar position="static" id="appBar">
      <Title onClick={onTitleClick}>WhenWhere</Title>
      <LinkContainer>
        {isAuthenticated && (
          <ButtonComponent
            variant="outlined"
            text="Create event"
            onClickFunction={onCreateEventClick}
          />
        )}
        {!isSignInRoute && (
          <ButtonComponent
            variant={isAuthenticated ? "negative" : "outlined"}
            text={isAuthenticated ? "Sign out" : "Sign in"}
            onClickFunction={onAuthButtonClick}
          />
        )}
      </LinkContainer>
    </StyledAppBar>
  );
}
