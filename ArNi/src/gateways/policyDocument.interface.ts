import { UserAccessReportWrapper } from "../store/document.model";
import { DocumentInfo } from "../store/policy.type";
import { SERVICE_TYPE } from "../utils/Enums";



export interface IPolicyDocumentFetcher {
    fetchDocumentsInf(policyId:number):Promise<DocumentInfo[]>;
    fetchDocument(policyId:number,documentId:number):Promise<File>;
    fetchPNPDocument(policyId:number,documentId:number):Promise<BlobPart[]>
    uploadDocument(policyId:number,file:File,createByIgg:string):Promise<DocumentInfo>
    updateDocument(policyId:number,file:File,createdBy:string,isPreviewable:string):Promise<any>;
    inactiveDocument(documentId:number):Promise<any>;
    reactiveDocument(documentId:number):Promise<any>;
    deleteDocument(documentId:number,serviceType:SERVICE_TYPE):Promise<any>;
    downloadDocument(policyId:number,maxDocDefNo:number,format:string,serviceType:SERVICE_TYPE,version:string):Promise<BlobPart[]>;
    downloadPNPDocument(policyId:number,maxDocDefNo:number,format:string,serviceType:SERVICE_TYPE,version?:string):Promise<BlobPart[]>;
    dowloadDocumentByRefId(documentRefId:string,format:string,version?:string):Promise<BlobPart[]>;
    downloadEmailReport(fromDate:string,toDate:string):Promise<Blob>;
    uploadPNPMetaData(metaData:string,file:File):Promise<any>;
    downloadUserAccessReport(userAccessReportWrapper:UserAccessReportWrapper):Promise<Blob>;
}