
import {Action, action, persist, Thunk, thunk} from 'easy-peasy';
import translationMessages, {MessageKeyValue, userLocale} from '../intl';


export interface IntlModel {
    locale: string,
    messages: MessageKeyValue;
    setLocale: Action<IntlModel,string>;
    setMessages: Action<IntlModel,string>;
    updateLocale:Thunk<IntlModel, string>;

}

const intl: IntlModel = {
    locale: userLocale,
    messages: translationMessages[userLocale] as any,
    setLocale: action((state, payload) => {
        state.locale = payload;
    }),
    setMessages: action((state, payload) => {
        state.messages = translationMessages[payload] as any;
    }),
    updateLocale: thunk((actions,payload) => {
        localStorage.setItem('my-pnp-locale',payload);
        actions.setLocale(payload);
        actions.setMessages(payload);
    }),
};

export default persist(intl);