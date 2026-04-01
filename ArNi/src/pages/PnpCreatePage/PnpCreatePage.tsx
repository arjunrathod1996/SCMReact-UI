import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";

const PnpCreatePage: React.FunctionComponent = () => {
    return (
        <div className="p-4 sm:ml-64 mt-12">
            <h1 className="text-2xl font-bold mb-4 mt-1 text-gray-300 uppercase">
                Add Document
            </h1>
            <div data-testid="main-content">
                <Container>
                    <nav aria-label="breadcrumb">
                        <ol className="flex space-x-2 ">
                            <li className="breadcrumb-item">
                                <Link to="/pnp/home">
                                    <span  style={{fontSize:'11px'}} className="hover:underline text-black-600">Home</span>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <span style={{fontSize:'11px'}} className="text-gray-500">/</span>
                            </li>
                            <li className="breadcrumb-item active text-blue-600">
                                <span style={{fontSize:'11px'}}>Add Document</span>
                            </li>
                        </ol>
                    </nav>
                    <div className="m-0 mt-5">
                    </div>
                    <br/>
                    <br/>
                </Container>
            </div>
        </div>
    );
};

export default PnpCreatePage;
