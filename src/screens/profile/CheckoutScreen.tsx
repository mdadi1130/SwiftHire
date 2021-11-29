import React, {useEffect, useState} from 'react';
import {Alert, Platform, SafeAreaView, StyleSheet, View} from "react-native";

import {Text, Button, Divider} from 'react-native-elements';
import {WINDOW_HEIGHT} from "../../utils/Constants";

import RNIap, {
    finishTransaction,
    InAppPurchase,
    PurchaseError,
    purchaseErrorListener,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from 'react-native-iap';

const IAP_SKUS = Platform.select({
    ios: [
        'sh_999_1m'
    ],
    android: [
        'SKU_1'
    ]
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const CheckoutScreen = (props) => {
    const [state, setState] = useState({
        productList: [],
        receipt: ''
    });

    // @ts-ignore
    useEffect(async () => {
        try {
            await RNIap.initConnection();
            if (Platform.OS === 'android') {
                await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
            } else {
                await RNIap.clearTransactionIOS();
            }
        } catch (err) {
            console.warn(err.code, err.message);
        }

        purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: InAppPurchase | SubscriptionPurchase) => {
                console.info('purchase', purchase);
                const receipt = purchase.transactionReceipt
                    ? purchase.transactionReceipt
                    // @ts-ignore
                    : purchase.originalJson;
                console.info(receipt);
                if (receipt) {
                    try {
                        const ackResult = await finishTransaction(purchase);
                        console.info('ackResult', ackResult);
                    } catch (err) {
                        console.warn('ackErr', err);
                    }
                    setState({
                        ...state,
                        receipt
                    });
                    Alert.alert('Receipt', state.receipt);
                }
            }
        );

        purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
                console.log('purchaseErrorListener', error);
                Alert.alert('purchase error', JSON.stringify(error));
            }
        );

        await getSubscriptions();

        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
                purchaseUpdateSubscription = null;
            }
            if (purchaseErrorSubscription) {
                purchaseErrorSubscription.remove();
                purchaseErrorSubscription = null;
            }
            RNIap.endConnection();
        };
    }, []);

    const getSubscriptions = async () => {
        try {
            const products = await RNIap.getSubscriptions(IAP_SKUS);
            console.log('Products', products);
            setState({
                ...state,
                productList: products
            });
        } catch (err) {
            console.warn(err.code, err.message);
        }
    };

    const requestSubscription = async (sku) => {
        try {
            RNIap.requestSubscription(sku);
        } catch (err) {
            Alert.alert(err.message);
        }
    };

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

            <Button title='Get plus for $9.99/month' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={() => requestSubscription(state.productList[0].productId)} />
        </SafeAreaView>
    );
};

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

export default CheckoutScreen;
