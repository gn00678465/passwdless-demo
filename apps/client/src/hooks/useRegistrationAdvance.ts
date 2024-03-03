import { useReducer } from "react";

export interface RegistrationAdvanceState {
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
}

export type RegistrationAdvanceActions =
  | { type: "ATTACHMENT"; payload: AuthenticatorAttachment | undefined }
  | { type: "USER_VERIFICATION"; payload: UserVerificationRequirement }
  | { type: "RESIDENTKEY"; payload: ResidentKeyRequirement }
  | { type: "ATTESTATION"; payload: AttestationConveyancePreference };

export function useRegistrationAdvance(
  defaultState: RegistrationAdvanceState = {
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "required"
    },
    attestation: "none"
  }
) {
  function reducer(state: RegistrationAdvanceState, action: RegistrationAdvanceActions) {
    switch (action.type) {
      case "ATTACHMENT":
        if (!action.payload) {
          return {
            ...state,
            authenticatorSelection: {
              userVerification: state.authenticatorSelection?.userVerification,
              residentKey: state.authenticatorSelection?.residentKey
            }
          };
        }
        return {
          ...state,
          authenticatorSelection: {
            ...state.authenticatorSelection,
            authenticatorAttachment: action.payload
          }
        };
      case "USER_VERIFICATION":
        return {
          ...state,
          authenticatorSelection: {
            ...state.authenticatorSelection,
            userVerification: action.payload
          }
        };
      case "RESIDENTKEY":
        return {
          ...state,
          authenticatorSelection: {
            ...state.authenticatorSelection,
            residentKey: action.payload
          }
        };
      case "ATTESTATION":
        return {
          ...state,
          attestation: action.payload
        };
      default:
        return state;
    }
  }

  return useReducer(reducer, defaultState);
}

export type UseRegistrationAdvanceReturn = ReturnType<typeof useRegistrationAdvance>;
