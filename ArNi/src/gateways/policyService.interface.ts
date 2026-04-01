import { Domain } from "../store/policy.type";

export interface  IPolicyFetcher {
    fetchDomain():Promise<Domain[]>
}