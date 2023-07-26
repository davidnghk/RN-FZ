export function actionTriggerShowModal(showModal: boolean, cause: string, messages: string) {
    return {
        type: '@@modal/SHOW_MODAL' as const,
        showModal: true,
        cause: cause,
        messages: messages
    };
};

export function closeModal() {
    return {
        type: '@@modal/CLOSE_MODAL' as const,
        showModal: false,
    };
};

export type ModalAction = ReturnType<typeof actionTriggerShowModal> | ReturnType<typeof closeModal>

