import React, {useState} from 'react';
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Avatar, FAB, Icon, Text} from "react-native-elements";
import {COLOR_PRIMARY, WINDOW_HEIGHT} from "../../utils/Constants";
import {useActionSheet} from "@expo/react-native-action-sheet";

export default function ProfileScreen(props) {
    const userAttrs = useSelector(state => state['AuthReducer'].user.attributes)
    const name = userAttrs['name'];
    const role = userAttrs['custom:role'];

    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(userAttrs['custom:profileImage']);

    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();

    const {showActionSheetWithOptions} = useActionSheet();

    const [openDropDown, setOpenDropDown] = useState(false);
    const [valueDropDown, setValueDropDown] = useState(null);
    const [itemsDropDown, setItemsDropDown] = useState([
        {label: 'Item 1', value: 'item1'},
        {label: 'Item 2', value: 'item2'}
    ]);

    const showImageContextMenu = message => {
            const options = ['Take a Photo', 'Choose Image from Library', 'Remove Profile Picture', 'Cancel'];
            const destructiveButtonIndex = 2;
            const cancelButtonIndex = 3;

            showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex
                },
                buttonIndex => {
                    switch (buttonIndex) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2: // delete
                            break;
                        case 3: // cancel
                            break;
                    }
                }
            );
        }

    return (
        <View style={{padding: 30}}>
            <Icon
                name='settings'
                tvParallaxProperties={true}
                size={30}
                style={{marginTop: 30, alignSelf: 'flex-end'}}
                onPress={() => props.navigation.navigate('Settings')}
            />

            <Text style={styles.title}>SwiftHire</Text>

            <Text style={styles.subtitle}>{role}</Text>

            <Avatar
                rounded size='large'
                source={{uri: image}}
                containerStyle={{alignSelf: 'center'}}
                overlayContainerStyle={{backgroundColor: '#808080'}}
                icon={{name: 'user', type: 'font-awesome'}}
            />
            <FAB
                size='small'
                icon={{name: 'edit', type: 'font-awesome'}}
                containerStyle={{marginTop: -30, left: 35}}
                buttonStyle={{backgroundColor: COLOR_PRIMARY}}
                onPress={showImageContextMenu}
            />

            <Text style={styles.body}>{name}</Text>

            <Text style={{...styles.sectionHeader, marginTop: 40}}>Desired Field</Text>
            <View>
                <Text style={styles.sectionBody}>Finance</Text>
            </View>

            <Text style={styles.sectionHeader}>Description</Text>
            <View>
                <Text style={styles.sectionBody}>This is an example of a user profile description! I am an MBA graduate with an interest in investment banking and expertise in the financial sector.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 40,
        fontFamily: 'Quicksand_600SemiBold',
        color: COLOR_PRIMARY,
        marginTop: WINDOW_HEIGHT * 0.01,
        marginBottom: WINDOW_HEIGHT * 0.01
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Quicksand_600SemiBold',
        color: COLOR_PRIMARY,
        marginBottom: WINDOW_HEIGHT * 0.03
    },
    body: {
        color: COLOR_PRIMARY,
        marginBottom: WINDOW_HEIGHT * 0.03,
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Raleway_500Medium'
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold'
    },
    sectionBody: {
        fontFamily: 'Montserrat_400Regular',
        margin: 24
    }
});
