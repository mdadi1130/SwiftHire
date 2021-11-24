import React from 'react';

import FileMessage from "./FileMessage";
import AdminMessage from "./AdminMessage";
import {withAppContext} from "../utils/Context";

const Message = (props) => {
    const {message} = props;

    if (message.isFileMessage()) {
        return <FileMessage {...props} />;
    } else if (message.isAdminMessage()) {
        return <AdminMessage {...props} />;
    } else {
        return null;
    }
};

export default withAppContext(Message);
