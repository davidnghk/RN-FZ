import { ModalAction } from "../actions/modal";



export interface ModalState {
    showModal: boolean,
    cause: string,
    messages: string,
};

const initialState = {
    showModal: false,
    cause: '',
    messages: '',
};

export const modalReducer = (state: ModalState = initialState, action: ModalAction) => {
    switch (action.type) {

        case '@@modal/SHOW_MODAL':
            return {
                ...state,
                showModal: action.showModal,
                cause: action.cause,
                messages: action.messages
            }

        case '@@modal/CLOSE_MODAL':
            return initialState

        default:
            return state
    }
};