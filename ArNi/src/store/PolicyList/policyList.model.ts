
import {MyPendingActionListModel,myPendingActionListModel} from '../PolicyList/MyPendingAction/MyPendingAction.model';

export interface PolicyListModel {
    myPendingActionList: MyPendingActionListModel;
}

export const policyListModel : PolicyListModel = {
    myPendingActionList: myPendingActionListModel,
}