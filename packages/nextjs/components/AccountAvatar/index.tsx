import { FC } from "react";
import { JazzIcon } from "../JazzIcon/index";
import { addressToJazzIconSeed } from "./addressToJazzIconSeed";

type AccountAvatarProps = {
  address: string;
  size: number;
  ensImage?: string | null;
};

export const AccountAvatar: FC<AccountAvatarProps> = ({ address, size }) => {
  if (!address) {
    return null;
  }

  return <JazzIcon diameter={size} seed={addressToJazzIconSeed({ address_eth: address as `0x${string}` })} />;
};
