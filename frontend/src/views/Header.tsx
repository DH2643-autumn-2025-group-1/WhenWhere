import { styled } from "styled-components";
import { AppBar } from "@mui/material";
import { ButtonComponent } from "../components/Button";

interface HeaderViewProps {
  isAuthenticated: boolean;
  onTitleClick: () => void;
  onAuthButtonClick: () => void;
  onCreateEventClick: () => void;
  onAboutButtonClick: () => void;
  showAuthButton: boolean; // new prop to control visibility
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

const Logo = styled.img`
  height: 48px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.large};
`;

export function HeaderView({
  isAuthenticated,
  onTitleClick,
  onAuthButtonClick,
  onCreateEventClick,
  onAboutButtonClick,
  showAuthButton,
}: HeaderViewProps) {
  return (
    <StyledAppBar position="static" id="appBar">
      <Logo
        src="/WhenWhere-logo-transparent-text.png"
        alt="WhenWhere"
        onClick={onTitleClick}
      />
      <LinkContainer>
        {isAuthenticated && (
          <ButtonComponent
            variant="outlined"
            text="Create event"
            onClickFunction={onCreateEventClick}
          />
        )}
        <ButtonComponent
          variant="outlined"
          text="About"
          onClickFunction={onAboutButtonClick}
        />
        {showAuthButton && (
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
