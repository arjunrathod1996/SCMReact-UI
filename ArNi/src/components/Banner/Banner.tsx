import { FC } from "react";
import { Alert } from "reactstrap";

interface BannerProps {
    color: string;
    titleId: string;
    display: boolean;
    toggle?: () => void;
}

const Banner: FC<BannerProps> = ({
    titleId,
    display,
    toggle,
    color
}) => {
    return (
        <Alert color={color} variant="filled" toggle={toggle} isOpen={display}>
            <div className="d-flex align-items-center">
                <i className="icon icon-md line-height-1 mr-1 pt-1" tabIndex={0}>info_outline</i>
                <div>
                    <span id={titleId}></span>
                </div>
            </div>
        </Alert>
    );
};

export default Banner;
