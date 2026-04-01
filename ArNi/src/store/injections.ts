import { Configuration } from "../configration";
import { IPolicyFetcher } from "../gateways/policyService.interface";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";


const policyService = Configuration.policyFetcher;

export interface Injections {
    policyService:IPolicyFetcher;
}

export const injections: Injections = {
   policyService,
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;