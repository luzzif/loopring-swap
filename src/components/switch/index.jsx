import React from "react";
import ReactSwitch from "react-switch";
import { selectedTheme } from "../../views/app";

export const Switch = ({ value, onChange }) => {
    return (
        <ReactSwitch
            height={16}
            width={32}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor={selectedTheme.primary}
            offColor="#5A6872"
            onChange={onChange}
            checked={value}
        />
    );
};
