import React from 'react';
import { Col } from 'reactstrap';

interface ActionCardProps {
    title?: string;
    icon?: string;
    onClick: () => void;
    subtitle?: string;
    backgroundColor: string;
    color: string;
    id: string;
}

const ActionCard: React.FunctionComponent<ActionCardProps> = ({ title, icon, onClick, backgroundColor, id }) => {
    return (
        <Col md="4" className='mt-3' tabIndex={0}>
            <div
                role="button"
                onClick={onClick}
                className='card'
                style={{ padding: '32px', backgroundColor }}
                id={id}
                aria-labelledby={`${id}-title`}
            >
                <div className='d-flex justify-content-between mt-2 mb-3'>
                    <h6 className='pt-2' id={`${id}-title`} aria-level={2}>
                        {title}
                    </h6>
                    <p className='m-0'>
                        {icon && <i className={`icon icon-md text-secondary ${icon}`} />} <span>&#8594;</span>
                    </p>
                </div>
            </div>
        </Col>
    );
};

export default ActionCard;
