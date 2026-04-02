import { useCallback } from "react";
import { useIntl } from "react-intl"
import { MasterData } from "../utils/Enums";

export const useDataIntl = () => {
    const {locale} = useIntl();
    const getLocalData = useCallback(
        (_referrntialObject:any, _type:MasterData)=>{
            //
        },[]
    );
    return {
        getLocalData,
    }
}