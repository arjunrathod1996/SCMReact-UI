
import { IPolicyDocumentFetcher } from "./gateways/policyDocument.interface";
import { IPolicyFetcher } from "./gateways/policyService.interface";



class ManualDependenciesConfiguration {

    private readonly _documentFetcher!: IPolicyDocumentFetcher;
    private readonly _policyFetcher!: IPolicyFetcher;
   
  
    get documentFetcher() : IPolicyDocumentFetcher{
        return this._documentFetcher;
    }
    get policyFetcher() : IPolicyFetcher{
        return this._policyFetcher;
    }
}

export const Configuration = new ManualDependenciesConfiguration();

