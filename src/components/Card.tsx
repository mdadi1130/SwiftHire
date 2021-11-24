import React from 'react';
import {StyleSheet, View} from "react-native";
import {Avatar, Icon, Image, Text} from "react-native-elements";

export const CandidateCard = ({company, image, title, description, salary}) => (
    <View style={candidateStyles.container}>
        <Avatar
            rounded size='xlarge'
            source={{uri: image}}
            icon={{name: 'business-outline', type: 'ionicon'}}
            overlayContainerStyle={{backgroundColor: '#808080'}}
            containerStyle={candidateStyles.imageContainer}
        />
        <Text style={candidateStyles.companyLabel}>{company}</Text>

        <Text style={candidateStyles.positionLabel}>{title}</Text>
        <Text style={candidateStyles.salaryLabel}>{salary}</Text>

        <Text style={candidateStyles.description}>{description}</Text>
    </View>
);

export const RecruiterCard = ({image, position, salary}) => (
    <View style={recruiterStyles.container}>
        <View style={{flex: 1}}>
            <Image source={image} style={recruiterStyles.imageContainer} />
            <Icon name='pencil' type='ionicon' tvParallaxProperties={true} />
        </View>
        <View style={{flex: 5, justifyContent: 'center'}}>
            <Text style={{...recruiterStyles.text, fontWeight: 'bold', marginBottom: 10}}>{position}</Text>
            <Text style={recruiterStyles.text}>{salary}</Text>
        </View>
    </View>
);

const candidateStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 20,
        shadowRadius: 5,
        shadowOpacity: 20,
        shadowColor: '#949494'
    },
    imageContainer: {
        marginTop: 60,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    companyLabel: {
        color: '#808080',
        margin: 30,
        fontSize: 22,
        textAlign: 'center'
    },
    positionLabel: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'left'
    },
    salaryLabel: {
        fontWeight: 'bold',
        fontSize: 27,
        textAlign: 'left',
        marginTop: 30,
        marginBottom: 30
    },
    description: {
        textAlign: 'center'
    }
});

const recruiterStyles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 15,
        padding: 15,
        borderRadius: 15,
        shadowRadius: 5,
        shadowOpacity: 20,
        shadowColor: '#949494'
    },
    imageContainer: {
        height: 30,
        width: 30,
        flex: 1,
        marginBottom: 10,
        marginEnd: 15
    },
    text: {
        textAlign: 'center',
        color: '#2a682a'
    }
});
