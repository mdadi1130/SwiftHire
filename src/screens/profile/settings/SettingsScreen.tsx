import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useDispatch} from "react-redux";
import {Text, Avatar, Icon, Button} from "react-native-elements";
import {COLOR_PRIMARY} from "../../../utils/Constants";

export default function SettingsScreen(props) {
    const [distance, setDistance] = useState(1);

    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.sectionHeader}>Account</Text>

            <TouchableOpacity>
                <View style={styles.rowContainer}>
                    <Avatar
                        rounded size='medium'
                        icon={{name: 'user', type: 'font-awesome'}}
                        overlayContainerStyle={{backgroundColor: '#808080'}}
                    />
                    <View>
                        <Text style={styles.settingLabel}>Name</Text>
                        <Text style={{marginTop: 4, marginLeft: 20}}>Personal Info</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Text style={{...styles.sectionHeader, marginBottom: 24}}>Settings</Text>

            <TouchableOpacity onPress={() => props.navigation.navigate('Checkout')}>
                <View style={styles.rowContainer}>
                    <Icon name='rocket' type='ionicon' color={COLOR_PRIMARY} tvParallaxProperties={true} />
                    <Text style={styles.settingLabel}>SwiftHire Plus</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.rowContainer}>
                    <Icon name='location' type='ionicon' color='#0096ff' tvParallaxProperties={true} />
                    <Text style={styles.settingLabel}>Location</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.rowContainer}>
                    <Icon name='notifications' type='ionicon' color='#ffae42' tvParallaxProperties={true} />
                    <Text style={styles.settingLabel}>Notifications</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={styles.rowContainer}>
                    <Icon name='information-circle' type='ionicon' color='#f07470' tvParallaxProperties={true} />
                    <Text style={styles.settingLabel}>About Us & Help</Text>
                </View>
            </TouchableOpacity>

            <Button
                icon={{name: 'log-out-outline', type: 'ionicon', color: COLOR_PRIMARY}}
                title='Sign Out'
                titleStyle={{color: COLOR_PRIMARY, fontFamily: 'Quicksand_600SemiBold'}}
                buttonStyle={{backgroundColor: '#fff', borderRadius: 30}}
                containerStyle={{marginTop: 70}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        paddingTop: 90
    },
    rowContainer: {
        flexDirection: 'row',
        margin: 16
    },
    title: {
        fontWeight: 'bold',
        fontSize: 48,
        marginBottom: 32,
        color: COLOR_PRIMARY
    },
    sectionHeader: {
        fontSize: 26,
        fontFamily: 'PTSans_700Bold'
    },
    settingLabel: {
        fontSize: 20,
        marginLeft: 20,
        fontFamily: 'PTSans_400Regular'
    }
});
