
import { useState } from "react";
import { useIntl } from "react-intl";
import { Button, ButtonGroup, Col, Row, TabContent, TabPane } from "reactstrap";
import { DOCUMENT_LIST_VIEWS } from "../../../utils/Enums"; // Ensure DOCUMENT_VIEW and ENTITY_VIEW are defined in Enums
import DocumentViewPending from "./DocumentViewPending/DocumentViewPending";

const MyPendingAction = () => {
    const { formatMessage } = useIntl();
    const [activeView, setActiveView] = useState(DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW); // Default to DOCUMENT_VIEW

    // Inline styles
    const containerStyle = {
        padding: "16px",
        marginTop: "70px",
    };

    const headerStyle = {
        fontWeight: "bold",
        color: "#333",
        fontSize: "2rem", // Adjust font size as needed
    };

    const buttonGroupStyle = {
        borderRadius: "30px",
        marginBottom: "16px",
    };



    const buttonStyle = {
        margin: "0 2px",
        backgroundColor: "#333", // Background color for tabs
        color: "#fff", // Text color for tabs
        padding: "5px 10px",
    };

    const activeButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#000", // Darker color for active tab
    };

    const contentBoxStyle = {
        padding: "20px",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    return (
        <div className="p-3 lg:ml-64 z-10 static" style={containerStyle}>
            <Row className="justify-content-center mb-4">
                <Col md="6" >
                    <h4 style={headerStyle} aria-level={1}>
                        {formatMessage({ id: 'pnp.mypnp.pedingActions' })}
                    </h4>
                </Col>
            </Row>

            {/* Centered Tab Buttons */}
            <Row className="justify-content-center mb-4">
                <Col md="6" className="text-center">
                    <ButtonGroup style={buttonGroupStyle}>
                        {/* Document View Button */}
                        <Button
                            style={activeView === DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW ? activeButtonStyle : buttonStyle}
                            onClick={() => setActiveView(DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW)}
                            active={activeView === DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW}
                        >
                            {formatMessage({ id: 'pnp.mypnp.documentView' })}
                        </Button>

                        {/* Entity View Button */}
                        <Button
                            style={activeView === DOCUMENT_LIST_VIEWS.ENTITY_VIEW ? activeButtonStyle : buttonStyle}
                            onClick={() => setActiveView(DOCUMENT_LIST_VIEWS.ENTITY_VIEW)}
                            active={activeView === DOCUMENT_LIST_VIEWS.ENTITY_VIEW}
                        >
                            {formatMessage({ id: 'pnp.mypnp.EntityView' })}
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>

            {/* Tab content area */}
            <Row className="justify-content-center">
                <Col md="8">
                    <TabContent  activeTab={activeView}>
                        {/* Document View  style={tabContentStyle} */}
                        <TabPane tabId={DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW}>
                            {activeView === DOCUMENT_LIST_VIEWS.DOCUMENT_VIEW && (
                                <div >
                                    {/* style={contentBoxStyle}<p>This is Document View</p> */}
                                    <DocumentViewPending />
                                </div>
                            )}
                        </TabPane>

                        {/* Entity View */}
                        <TabPane tabId={DOCUMENT_LIST_VIEWS.ENTITY_VIEW}>
                            {activeView === DOCUMENT_LIST_VIEWS.ENTITY_VIEW && (
                                <div style={contentBoxStyle}>
                                    <p>This is Entity View</p>
                                </div>
                            )}
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </div>
    );
};

export default MyPendingAction;
