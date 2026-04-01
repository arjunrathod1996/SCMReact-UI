import { PolicyAllData } from "./types";

const initialPolicyDetails: PolicyAllData = {
    inProgress: 0,
    allPolicyType: [],
    allPnpPolicyEntities: [],
    allPolicyRisks: [],
    initiatorTaskId: "",
    allBusus: [],
    allContentReviewStatus: []
};

export interface PolicyModel {
    policyData: PolicyAllData;
   
}

export const policyModel: PolicyModel = {
    policyData: initialPolicyDetails,
};
