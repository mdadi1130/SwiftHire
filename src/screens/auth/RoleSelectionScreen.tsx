import React from 'react';
import {StyleSheet, View, Dimensions} from "react-native";

import {Button, Text} from "react-native-elements";
import {WINDOW_HEIGHT} from "../../utils/Constants";

export default function RoleSelectionScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SwiftHire</Text>

            <Text style={styles.subtitle}>I'm a...</Text>

            <Button
                title="Candidate"
                onPress={() => props.navigation.navigate('RegisterDetails', 'Candidate')}
                titleStyle={styles.buttonText}
                buttonStyle={styles.button}/>
            <Button
                title="Recruiter"
                onPress={() => props.navigation.navigate('RegisterDetails', 'Recruiter')}
                titleStyle={styles.buttonText}
                buttonStyle={styles.button}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: WINDOW_HEIGHT
    },
    title: {
        fontSize: 60,
        fontFamily: 'Quicksand_600SemiBold',
        color: 'white',
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.2
    },
    subtitle: {
        fontSize: 40,
        color: 'white',
        textAlign: 'center',
        margin: WINDOW_HEIGHT * 0.1
    },
    button: {
        width: WINDOW_HEIGHT * 0.35,
        marginBottom: WINDOW_HEIGHT * 0.1,
        backgroundColor: 'white',
        borderRadius: 30
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000000'
    }
});
