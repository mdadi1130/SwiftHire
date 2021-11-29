import React from 'react';

import FileMessage from "./FileMessage";
import AdminMessage from "./AdminMessage";
import {withAppContext} from "../utils/Context";
import UserMessage from "./UserMessage";

const Message = (props) => {
    const {message} = props;
    let component = null
    if (message.isFileMessage()) {
        component = <FileMessage {...props} />;
    } else if (message.isAdminMessage()) {
        component = <AdminMessage {...props} />;
    } else if (message.isUserMessage()) {
        component = <UserMessage {...props} />;
    }
    return component;
};

export default withAppContext(Message);
