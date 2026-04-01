import { useCallback } from "react";
import { useIntl } from "react-intl"
import { MasterData } from "../utils/Enums";

export const useDataIntl = () => {
    const {locale} = useIntl();
    const getLocalData = useCallback(
        (referrntialObject:any, type:MasterData)=>{

        },[locale]
    );
    return {
        getLocalData,
    }
}