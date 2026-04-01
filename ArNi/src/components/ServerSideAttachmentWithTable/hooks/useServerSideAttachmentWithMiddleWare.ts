import { useEffect, useReducer, useRef } from 'react';

// Define your types here
interface ServerSideAttachmentTableActions {
  type: string;
  // Add other fields here if needed
}

interface ServerSideAttachmentWithMiddleWare {
  afterWareFns?: ((actionType: string) => void)[];
  middleWareFns?: ((action: ServerSideAttachmentTableActions) => void)[];
}

interface ServerSideDocumentReducer {
  state: any;  // Define your state type based on your reducer's state
  dispatchWithMiddleWare: (action: ServerSideAttachmentTableActions) => void;
}

const REDUCER_INTITIAL_STATE = {}; // Initialize your reducer state

// The reducer function (severSideFileUploadReducer) needs to be defined somewhere
const severSideFileUploadReducer = (state: any, action: ServerSideAttachmentTableActions) => {
  // Implement the reducer logic here
  return state;
};

const useServerSideAttachmentWithMiddleWare = ({
  afterWareFns,
  middleWareFns,
}: ServerSideAttachmentWithMiddleWare): ServerSideDocumentReducer => {
  const [state, dispatch] = useReducer(severSideFileUploadReducer, REDUCER_INTITIAL_STATE);

  const aRef = useRef<string>('');  // Ensure the type is string, since you use it as such

  const dispatchWithMiddleWare = (action: ServerSideAttachmentTableActions) => {
    aRef.current = action.type;
    dispatch(action);
  };

  useEffect(() => {
    if (aRef.current === '') {
      return;
    }

    // Call the afterWareFns if they exist
    afterWareFns?.forEach((afterWareFn) => afterWareFn(aRef.current));
    aRef.current = '';
  }, [state, afterWareFns]);  // Ensure afterWareFns is correctly handled in dependencies

  return { state, dispatchWithMiddleWare };
};

export default useServerSideAttachmentWithMiddleWare;
