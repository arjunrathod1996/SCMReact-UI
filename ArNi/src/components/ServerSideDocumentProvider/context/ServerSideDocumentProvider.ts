import { createContext, useContext } from "react";
import { ServerSideDocumentReducer } from "../../ServerSideAttachmentWithTable/typings/typings";

export const ServerSideDocumentTableContext = createContext<ServerSideDocumentReducer>(undefined as any);
ServerSideDocumentTableContext.displayName = 'ServerSideAttachmentContext';

export const ServerSideDocumentProvider = ServerSideDocumentTableContext.Provider;
export const ServerSideDocumentConsumer= ServerSideDocumentTableContext.Consumer;

export function useServerSideAttachmentWithMiddleWare(){
    return useContext<ServerSideDocumentReducer>(ServerSideDocumentTableContext);
}