import "styled-components";
import type { ThemeType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends Record<string, unknown>, ThemeType {}
}
