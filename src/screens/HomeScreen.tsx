import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, StyleSheet} from "react-native";

import {Avatar, Button, Input, Overlay, Text} from "react-native-elements";

import {useSelector} from 'react-redux';

import {API, graphqlOperation} from "aws-amplify";
import {createJob} from "../graphql/mutations";
import {listJobs} from "../graphql/queries";

import GestureRecognizer from 'react-native-swipe-gestures';
import Swiper from "react-native-deck-swiper";
import {CandidateCard, RecruiterCard} from "../components/Card";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {WINDOW_HEIGHT} from "../utils/Constants";

export default function HomeScreen(props) {
    const userAttrs = useSelector(state => state['AuthReducer'].user.attributes);
    const role = userAttrs['custom:role'];
    const image = userAttrs['custom:profileImage'];
    const company = userAttrs['custom:companyName'];

    const [visible, setVisible] = useState(false);

    const [jobs, setJobs] = useState([]);

    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');

    const fetchJobs = async () => {
        try {
            const jobData = await API.graphql(graphqlOperation(listJobs))
            const jobs = jobData['data'].listJobs.items
            setJobs(jobs)
        } catch (err) {
            console.log('error fetching jobs')
        }
    };

    useEffect(() => {
        fetchJobs().then(() => console.log(jobs))
    }, []);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const postJob = async (title, description, company, salary, image) => {
        const job = {title: title, description: description, company: company, salary: salary, image: image};
        await API.graphql(graphqlOperation(createJob, {input: job}));
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>SwiftHire</Text>
            <Text style={styles.subtitle}>{role}</Text>

            {jobs.length > 0 && role === 'Candidate' &&
            <Swiper
                cards={jobs}
                renderCard={CandidateCard}
                verticalSwipe={false}
                infinite
                backgroundColor='transparent'
                cardHorizontalMargin={0}
                stackSize={2}
                containerStyle={{marginTop: 150}}
            />
            }

            {role === 'Recruiter' &&
            <FlatList data={null} renderItem={({item}) =>
                <RecruiterCard image={item.image} position={item.position} salary={item.salary}/>}
                      refreshControl={<RefreshControl colors={['#fff']} tintColor='#338a33' refreshing={false}/>}
            />
            }

            {role === 'Recruiter' &&
            <Button title='Add a Listing' buttonStyle={styles.button} titleStyle={styles.buttonText}
                    onPress={toggleOverlay}/>
            }
            <GestureRecognizer onSwipeDown={toggleOverlay}>
                <Overlay presentationStyle='pageSheet' fullScreen={true}
                         overlayStyle={{justifyContent: 'center', display: 'flex'}}
                         backdropStyle={{backgroundColor: 'white'}} transparent={false} isVisible={visible}
                         onBackdropPress={toggleOverlay} animationType='slide' style={{alignSelf: 'flex-start'}}>
                    <KeyboardAwareScrollView contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 15
                    }}>
                        <Avatar rounded source={{uri: image}} icon={{name: 'business-outline', type: 'ionicon'}}
                            // @ts-ignore
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 80,
                                    marginTop: 60,
                                    alignSelf: 'center',
                                    overflow: 'hidden',
                                    marginBottom: 20
                                }}
                        />
                        <Input style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} label='Position Name' placeholder='Position' returnKeyType='next' onSubmitEditing={() => {
                            this.salaryTextInput.focus()
                        }} onChangeText={value => setPosition(value)}/>
                        <Input ref={(input) => {
                            this.salaryTextInput = input;
                        }} returnKeyType='next' onSubmitEditing={() => {
                            this.locationTextInput.focus()
                        }} containerStyle={{justifyContent: 'center'}} label='Salary Range' placeholder='$1k-$100k' onChangeText={value => setSalary(value)}/>
                        <Input label='Location' ref={(input) => {
                            this.locationTextInput = input;
                        }} returnKeyType='next' onSubmitEditing={() => {
                            this.descriptionTextInput.focus()
                        }}/>
                        <Input label='Description' multiline={true} ref={(input) => {
                            this.descriptionTextInput = input;
                        }} onChangeText={value => setDescription(value)}/>
                        <Button title='Post' buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={() => postJob(position, description, company, salary, image).then(() => setVisible(false))}/>
                    </KeyboardAwareScrollView>
                </Overlay>
            </GestureRecognizer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%'
    },
    title: {
        fontSize: 40,
        fontFamily: 'Quicksand_600SemiBold',
        color: '#2a682a',
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.01,
        marginBottom: WINDOW_HEIGHT * 0.001
    },
    subtitle: {
        fontSize: 18,
        color: '#2a682a',
        textAlign: 'center',
        margin: WINDOW_HEIGHT * 0.02,
        fontFamily: 'Quicksand_600SemiBold'
    },
    button: {
        backgroundColor: '#2a682a',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.1,
        marginBottom: WINDOW_HEIGHT * 0.05,
        paddingTop: 12,
        paddingBottom: 12,
        width: WINDOW_HEIGHT * 0.35,
        alignSelf: 'center'
    },
    buttonText: {
        fontFamily: 'Quicksand_600SemiBold',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 30
    }
});
