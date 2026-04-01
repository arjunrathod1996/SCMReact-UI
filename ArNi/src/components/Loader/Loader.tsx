// import React, { FunctionComponent } from 'react';
// import { useIntl } from 'react-intl';
// import { Spinner } from 'reactstrap';

// interface LoaderProps {
//     type?: 'SPINNER' | 'LOADER' | 'FILE_LOADING';
//     loading: boolean;
//     children?: React.ReactNode; // Correcting the typo
// }

// const Loader: FunctionComponent<LoaderProps> = ({ type = 'SPINNER', loading, children }) => {
//     const { formatMessage } = useIntl();

//     if (!loading) {
//         return <>{children}</>; // Corrected children usage
//     }

//     if (type === 'LOADER') {
//         return (
//             <div className='spinner-grow' role="status">
//                 {formatMessage({ id: 'pnp.fields.loading' })}
//             </div>
//         );
//     }

//     return <Spinner color='dark' />;
// };

// export default Loader;

// Loader.tsx
// Loader.tsx
import React from "react";

type LoaderProps = {
    type?: "SPINNER" | "CIRCLE";
    loading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ type = "SPINNER", loading }) => {
    if (!loading) return null;

    return (
        <div className="flex justify-center items-center h-64">
            {type === "SPINNER" ? (
                <div className="loader-spinner"></div>
            ) : (
                <div className="loader-circle"></div>
            )}
            <style>
                {`
                    .loader-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid #ddd;
                        border-top-color: #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    
                    .loader-circle {
                        width: 50px;
                        height: 50px;
                        border: 5px solid transparent;
                        border-top: 5px solid #3b82f6;
                        border-right: 5px solid #3b82f6;
                        border-radius: 50%;
                        animation: rotate 1.5s ease infinite;
                    }
                    
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    @keyframes rotate {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;
