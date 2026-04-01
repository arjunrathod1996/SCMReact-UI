

import { flatten } from '../intl/flatten';

import {MessageKeyValue} from '../types';

import en from '../intl/en.messages';
import es from '../intl/es.messages';

export * from '../types';

export const userLocale = navigator.language.toLowerCase().split(/[_-]+/)[0]; // name should be same other also (wherever mapping)

const translationMessages: MessageKeyValue = {
    en: flatten(en),
    fr: flatten(es)
};

export default translationMessages;

