import intl, { IntlModel } from "../store/intl.model";
import { pnpDataModel, PNPDataModel } from "../store/PNPData.model";
import { policyModel, PolicyModel } from "./policy.model";

export interface AppStoreModel {
    intl: IntlModel;
    pnp: PNPDataModel;
    policyDetails: PolicyModel;
}

const model: AppStoreModel = {
    intl,
    pnp: pnpDataModel,
    policyDetails: policyModel,
};

export default model;
