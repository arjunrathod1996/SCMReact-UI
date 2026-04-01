
export interface ServerSideDocumentReducer {
    state : ServerSideAttachmentWithTableState;
    dispatchWithMiddleWare: (action: ServerSideAttachmentTableActions) => void;
}