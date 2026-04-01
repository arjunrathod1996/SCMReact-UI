// import {createTypedHooks} from 'easy-peasy';

// import {AppStoreModel} from '../store/model';

// const typedHooks = createTypedHooks<AppStoreModel>();

// export const useStoreActions = typedHooks.useStoreActions;
// export const useStoreDispatch = typedHooks.useStoreDispatch;
// export const useStoreState = typedHooks.useStoreState;

import { createTypedHooks } from 'easy-peasy';
import { AppStoreModel } from './model'; // Import your store model

const typedHooks = createTypedHooks<AppStoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;


