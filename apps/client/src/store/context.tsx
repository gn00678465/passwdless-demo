import { createContext } from "react";
import type { ReactNode, Dispatch, FC } from "react";
import type { RegistrationAdvanceState, RegistrationAdvanceActions } from "../hooks";

type ContextValue = {
  registerAdvOpts?: RegistrationAdvanceState;
  dispatchRegisterAdvOpts?: Dispatch<RegistrationAdvanceActions>;
};

export const AdvanceOptionsContext = createContext<ContextValue>({});

type AdvanceOptionsContextProviderProps = ContextValue & {
  children?: ReactNode;
};

export const AdvanceOptionsContextProvider: FC<AdvanceOptionsContextProviderProps> = ({
  children,
  registerAdvOpts,
  dispatchRegisterAdvOpts
}) => {
  return (
    <AdvanceOptionsContext.Provider value={{ registerAdvOpts, dispatchRegisterAdvOpts }}>
      {children}
    </AdvanceOptionsContext.Provider>
  );
};
