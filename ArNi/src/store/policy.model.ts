import { PolicyAllData } from "./policy.type";

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
