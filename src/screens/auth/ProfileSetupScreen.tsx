import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import {Text, Input, Button} from 'react-native-elements';

export default function ProfileSetupScreen(props) {
    const role = props.route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SwiftHire</Text>
            <Text style={styles.subtitle}>{role}</Text>

            <Text></Text>
            <Input placeholder="" />

            <Button buttonStyle={styles.button} titleStyle={styles.buttonText} title='Next' onPress={() => props.navigation.navigate('Location')} />
        </View>
    )
}

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 60,
        fontFamily: 'Quicksand_600SemiBold',
        color: 'white',
        textAlign: 'center',
        marginTop: height * 0.02
    },
    subtitle: {
        fontSize: 28,
        color: 'white',
        textAlign: 'center',
        margin: height * 0.02,
        fontFamily: 'Quicksand_600SemiBold'
    },
    button: {
        width: height * 0.35,
        marginBottom: height * 0.1,
        backgroundColor: 'white',
        borderRadius: 30
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000000'
    }
});
