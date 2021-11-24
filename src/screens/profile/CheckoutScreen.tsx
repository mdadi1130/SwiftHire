import React from 'react';
import {SafeAreaView, StyleSheet, View} from "react-native";

import {Text, Button, Divider} from 'react-native-elements';
import {WINDOW_HEIGHT} from "../../utils/Constants";

export default function CheckoutScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>SwiftHire +</Text>
            <Text style={styles.subtitleText}>A modern job solution</Text>

            <View style={{backgroundColor: '#f5f5f5'}}>
                <Divider style={styles.outerDivider} orientation='horizontal' width={1.5}/>

                <Text style={styles.headingText}>Turn Off Ads</Text>
                <Text style={styles.descriptionText}>Less distractions, more focus</Text>

                <Divider style={styles.innerDivider} orientation='horizontal' width={1}/>

                <Text style={styles.headingText}>Boost Your Profile</Text>
                <Text style={styles.descriptionText}>Put your resume on the top of the list</Text>

                <Divider style={styles.innerDivider} orientation='horizontal' width={1}/>

                <Text style={styles.headingText}>Unlimited Swipes</Text>
                <Text style={styles.descriptionText}>Uninterrupted access to our exclusive listings</Text>

                <Divider style={styles.innerDivider} orientation='horizontal' width={1}/>

                <Text style={styles.headingText}>See Who Views Your Profile</Text>
                <Text style={styles.descriptionText}>Build your network</Text>

                <Divider style={styles.outerDivider} orientation='horizontal' width={1.5}/>
            </View>

            <Button title='Get plus for $9.99/month' buttonStyle={styles.button} titleStyle={styles.buttonText}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff'
    },
    button: {
        backgroundColor: '#2a682a',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.05,
        marginBottom: WINDOW_HEIGHT * 0.1,
        padding: 12,
        width: WINDOW_HEIGHT * 0.35,
        alignSelf: 'center'
    },
    buttonText: {
        fontFamily: 'Quicksand_600SemiBold',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 21
    },
    titleText: {
        textAlign: 'center',
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 28,
        color: '#2a682a'
    },
    subtitleText: {
        textAlign: 'center',
        fontFamily: 'Quicksand_600SemiBold',
        fontSize: 16,
        color: '#2a682a',
        marginBottom: WINDOW_HEIGHT * 0.05
    },
    headingText: {
        marginLeft: '10%',
        fontWeight: 'bold'
    },
    descriptionText: {
        marginLeft: '10%'
    },
    innerDivider: {
        width: '90%',
        margin: WINDOW_HEIGHT * 0.05
    },
    outerDivider: {
        width: '100%',
        marginTop: WINDOW_HEIGHT * 0.05,
        alignSelf: 'center'
    }
});
