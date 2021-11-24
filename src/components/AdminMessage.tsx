import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from "react-native-elements";
import {withAppContext} from "../utils/Context";

const AdminMessage = (props) => {
    const {message} = props;

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.message}>{message.message}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12
    },
    message: {
        fontSize: 18,
        color: '#ccc'
    }
});

export default withAppContext(AdminMessage);
