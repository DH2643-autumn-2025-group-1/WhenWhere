import styled, { css } from "styled-components";
import { AppBar } from "@mui/material";

export interface HeaderViewProps {
  onTitleClick: () => void;
  onLoginClick: () => void;
  isLoginActive: boolean;
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

export function HeaderView({
  onTitleClick,
  onLoginClick,
  isLoginActive,
}: HeaderViewProps) {
  return (
    <StyledAppBar position="static" id="appBar">
      <Title onClick={onTitleClick}>WhenWhere</Title>
      <LinkContainer>
        <NavigationLink onClick={onLoginClick} $active={isLoginActive}>
          Log in
        </NavigationLink>
      </LinkContainer>
    </StyledAppBar>
  );
}
