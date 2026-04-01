
import { DocumentDetails} from '../../PolicyList/MyPendingAction/MyPendingActionDetail.type';

export interface MyPendingActionListModel {
    documentList: DocumentDetails[];
    documentLoading: boolean;
}

export const myPendingActionListModel : MyPendingActionListModel = {
    documentList:[],
    documentLoading:false,
}