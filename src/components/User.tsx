import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";

import {Icon, Image, Text} from "react-native-elements";
import {withAppContext} from "../utils/Context";

const User = (props) => {
    const {user, selected, selectable, onSelect} = props;

    const [select, setSelect] = useState(selected);

    const onPress = () => {
        if (selectable) {
            setSelect(!select);
            onSelect(user);
        }
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.75} onPress={() => onPress()}>
            <View style={styles.profileImageContainer}>
                <Image source={{ uri: user.profileUrl }} style={styles.profileImage} />
                {selected && <Icon name="done" color="#fff" style={styles.check} size={40} tvParallaxProperties={true} />}
            </View>
            <Text style={styles.nickname}>{user.nickname || '(Unnamed)'}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 8,
        alignItems: 'center'
    },
    profileImageContainer: {
        position: 'relative',
        width: 40,
        height: 40,
        marginRight: 12
    },
    profileImage: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderWidth: 0,
        borderRadius: 20
    },
    check: {
        position: 'absolute',
        width: 40,
        height: 40,
        opacity: 0.6,
        borderWidth: 0,
        borderRadius: 20,
        backgroundColor: '#666'
    },
    nickname: {
        fontSize: 18,
        color: '#666'
    }
});

export default withAppContext(User);
