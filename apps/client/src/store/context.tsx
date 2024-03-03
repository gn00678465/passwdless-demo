import { createContext } from "react";
import type { ReactNode, Dispatch, FC } from "react";
import type {
  RegistrationAdvanceState,
  RegistrationAdvanceActions,
  AuthenticationAdvanceState,
  AuthenticationAdvanceActions
} from "../hooks";

type ContextValue = {
  registerAdvOpts?: RegistrationAdvanceState;
  dispatchRegisterAdvOpts?: Dispatch<RegistrationAdvanceActions>;
  authAdvOpts?: AuthenticationAdvanceState;
  dispatchAuthAdvOpts?: Dispatch<AuthenticationAdvanceActions>;
};

export const AdvanceOptionsContext = createContext<ContextValue>({});

type AdvanceOptionsContextProviderProps = ContextValue & {
  children?: ReactNode;
};

export const AdvanceOptionsContextProvider: FC<AdvanceOptionsContextProviderProps> = ({
  children,
  registerAdvOpts,
  dispatchRegisterAdvOpts,
  authAdvOpts,
  dispatchAuthAdvOpts
}) => {
  return (
    <AdvanceOptionsContext.Provider
      value={{ registerAdvOpts, dispatchRegisterAdvOpts, authAdvOpts, dispatchAuthAdvOpts }}
    >
      {children}
    </AdvanceOptionsContext.Provider>
  );
};
