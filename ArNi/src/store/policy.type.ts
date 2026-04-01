import { RoleMyPNPTAB } from "../utils/Enums";



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

export interface Country {
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