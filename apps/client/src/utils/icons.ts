import { FunctionComponent, SVGProps } from "react";

import PasskeysSvg from "../assets/icons/passkeys.svg";
import TrashSvg from "../assets/icons/trash.svg";

export type IconNames = "passkeys" | "trash";

const iconMap = {
  passkeys: PasskeysSvg,
  trash: TrashSvg
} as unknown as Record<
  IconNames,
  FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >
>;

export const Passkeys = iconMap["passkeys"];
export const Trash = iconMap["trash"];
