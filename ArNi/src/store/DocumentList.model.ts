import { Action, action} from 'easy-peasy';

import {DOCUMENT_LIST_TABS, DOCUMENT_LIST_VIEWS} from './../utils/Enums';
import {certifyModel, CertifyModel} from './../store/PNP/certify/certify.model';

export interface DocumentListModel {
    certify: CertifyModel;
    activeTab: DOCUMENT_LIST_TABS | undefined;
    setActiveTab: Action<DocumentListModel, DOCUMENT_LIST_TABS>;
    activeView: DOCUMENT_LIST_VIEWS | undefined;
    setActiveView: Action<DocumentListModel,DOCUMENT_LIST_VIEWS>;
}

export const documentListModel: DocumentListModel = {
    certify: certifyModel,
    activeTab: undefined,
    setActiveTab: action((state, payload:DOCUMENT_LIST_TABS) => {
        state.activeTab = payload;
    }),
    activeView: undefined,
    setActiveView: action((state, payload:DOCUMENT_LIST_VIEWS) => {
        state.activeView = payload;
    }),
};