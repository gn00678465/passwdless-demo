import { useReducer } from "react";

export interface AuthenticationAdvanceState {
  authenticatorSelection?: {
    userVerification?: UserVerificationRequirement;
  };
}

export type AuthenticationAdvanceActions = {
  type: "USER_VERIFICATION";
  payload: UserVerificationRequirement;
};

export function useAuthenticationAdvance(
  defaultState: AuthenticationAdvanceState = {
    authenticatorSelection: {
      userVerification: "preferred"
    }
  }
) {
  function reducer(state: AuthenticationAdvanceState, action: AuthenticationAdvanceActions) {
    switch (action.type) {
      case "USER_VERIFICATION":
        return {
          ...state,
          authenticatorSelection: {
            userVerification: action.payload
          }
        };
      default:
        return state;
    }
  }

  return useReducer(reducer, defaultState);
}

export type UseAuthenticationAdvanceReturn = ReturnType<typeof useAuthenticationAdvance>;
