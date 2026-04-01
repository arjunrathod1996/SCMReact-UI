// Consolidated interfaces from various files

import { SERVICE_TYPE, RoleMyPNPTAB } from "./utils/Enums";
import { UserAccessReportWrapper } from "./store/document.model";

// From src/components/service/RoleService.tsx
export interface Role {
  id: string | number;
  name: string;
  tag: string;
}

// From src/intl/types.ts
export interface MessageKeyValue {
    [key: string]: Record<string,string>;
}

export interface Region {
  id: number;
  creationTime: string;
  updateTime: string;
  country: Country;
  state: string;
  city: string;
  zone: string;
  countryID: number;
}

export interface Country {
  id: number;
  creationTime: string;
  updateTime: string;
  name: string;
  state: string;
  city: string;
  zone: string;
  countryID: number;
}

// From src/store.ts
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  phoneNumber?: string;
  city?: string;
}

// From src/store/PolicyList/policyList.model.ts
export interface PolicyListModel {
    myPendingActionList: MyPendingActionListModel;
}

// From src/store/PolicyList/MyPendingAction/MyPendingActionDetail.type.ts
export interface DocumentDetails {
    policyId: string;
    domainRisk: string;
    documentName: string;
    sgCodeReference: string;
    policyPublicationDate: string;
    documentType: string;
    busu: string;
    implementationDeadlineDate: string;
    dispensationDeadlineDate: string;
    mypnpStatus: string;
}

// From src/store/PolicyList/MyPendingAction/MyPendingAction.model.ts
export interface MyPendingActionListModel {
    documentList: DocumentDetails[];
    documentLoading: boolean;
}

// From src/gateways/policyService.interface.ts
export interface IPolicyFetcher {
    fetchDomain():Promise<Domain[]>
}

// From src/gateways/policyDocument.interface.ts
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

// From src/store/policy.type.ts
export interface Domain {
    id:number;
    nameEng:string;
    nameFra:string;
    shortNameEng?:string;
    shortNameFra?:string;
    ative:boolean;
}

export interface PolicyRisk {
    id:number;
    domain:Domain;
    nameEng:string;
    nameFra:string;
    value:string;
    active:boolean;
}

export interface MacroProcess {
    id:number;
}

export interface CountryEntity {
    id:number;
    active:boolean;
}

export interface DocumentInfo {
    createdBy?:string;
    createdDate?:string;
    docType?:string;
    documentRefId?:string;
    documentStorageSystemRefId?:string;
    id:number;
    link?:string;
    policyId?:number;
    isPreviewable?:string;
    updatedBy?:string;
    version?:string;
}

export interface Entities {
    busu: string;
    busuCode: string;
    busuOuid: number;
    identification: string;
    legalName: string;
    nationalityCode: string;
    officailName: string;
    pole: string;
    polieId: number;
    overSightEnum: OversightEnum;
    riskEntities: RiskApplicationEntities[];
    activate: boolean;
    activeInPerle: boolean;
}

export enum OversightEnum {
    STANDARD = 'STANDARD',
    SIMPLIFIED = 'SIMPLIFIED',
}

export interface RiskApplicationEntities {
    domainId:number;
    id:number;
    riskId:number,
    identification:string;
    active:boolean;
}

export interface PolicyAllData {
    inProgress: number;
    allPolicyType: PolicyType[];
    allPnpPolicyEntities: Entities[];
    allPolicyRisks: PolicyRisk[];
    initiatorTaskId: string;
    allBusus: BuSuReferntial[];
    allContentReviewStatus : ContentReview[];
}

export interface PolicyType {
    id:number;
    type:string;
}

export interface BuSuReferntial{
    busu:string;
    children:BuSuReferntial[];
    level:number;
    value:string;
    label:string;
    checked?:boolean;
}

export interface ContentReviewModel {
    contentReviewStatus: number;
    rowId?:number;
    policyAcknowledgeId:number;
    contentReviewDate:string;
    activeRoleTab:RoleMyPNPTAB;
}

export interface ContentReview {
    id:number;
    nameEng:string;
    nameFra:string;
    rank:number;
    value:string;
    active:boolean;
}

export interface Config {
    API_BASE_URL?: string;
    SCM_END_POINT?: string;
  }
  
  declare global {
    interface Window {
      config: Config;
    }
  }
  
