export enum PNPRoles {
    OWNER = 'ui.pnp.pnp_owner',
    PUBLISHER = 'ui.pnp.my.p&p.publisher',
    CORRESPONDENT = 'ui.pnp.corresondent',
    SUPERUSER = 'ui.pnp.super.user',
    OVER_SIGHT = 'ui.pnp.pnp_oversight',
    CENTRAL_APPROVER = 'ui.pnp.central.approver',
    LOCAL_APPROVER = 'ui.pnp.local.approver',
    READER = 'ui.pnp.reader',
}

export enum DOCUMENT_LIST_VIEWS {
    DOCUMENT_VIEW = "DOCUMENT_VIEW",
    ENTITY_VIEW = "ENTITY_VIEW"
}

export enum DOCUMENT_LIST_TABS {
    PENDING_ACTION = "My Pending Acrion(s)",
    MY_PNP = "My P&P Scope",
    DISPENSATION = "Dispensation Request(s)",
}

export enum SERVICE_TYPE {
    PPS,
    PNP,
}

export enum MasterData {
    RISK = 'RISK',
    DOMAIN_AREA= 'DOMAIN_AREA'
}

export enum RoleMyPNPTAB {
    OWNER = 'OWNER',
    EDITOR = 'EDITOR',
    CORRESPONDENT = 'CORRESPONDENT',
    OVERSIGHT = 'OVERSIGHT',
}