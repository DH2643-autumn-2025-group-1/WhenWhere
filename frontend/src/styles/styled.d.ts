/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components";
import type { ThemeType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
