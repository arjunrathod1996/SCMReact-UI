import React, { ReactNode } from "react";
import { FormGroup, Label, FormText } from "reactstrap";

interface FormfieldProps {
  errorMsg?: string;
  id?: string;
  mandatory?: boolean;
  validation?: boolean;
  labelFor?: string;
  infoToolTip?: ReactNode;
  children: ReactNode; // Added children prop type
}

const Formfield: React.FunctionComponent<FormfieldProps> = ({
  errorMsg,
  id,
  mandatory,
  children,
  validation,
  labelFor,
  infoToolTip,
}) => {
  return (
    <FormGroup className="my-1">
      {labelFor && (
        <Label htmlFor={labelFor}>
          {id && <span>{id}</span>}
          {mandatory && <span className="text-danger">*</span>} {/* Show asterisk for mandatory fields */}
          {infoToolTip && <span className="ml-2">{infoToolTip}</span>} {/* Show tooltip if available */}
        </Label>
      )}
      {children} {/* Render children here */}
      {errorMsg && validation && <FormText color="danger">{errorMsg}</FormText>} {/* Show error message if validation fails */}
    </FormGroup>
  );
};

export default Formfield;
