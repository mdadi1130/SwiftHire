import Voice, {SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent} from '@react-native-voice/voice';
import {useEffect, useState} from "react";

const VoiceRecognitionHelper = () => {
    const [state, setState] = useState({
        recognized: false,
        pitch: '',
        error: '',
        end: false,
        started: false,
        results: [],
        partialResults: []
    });

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChange;

        return function cleanup() {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, []);

    const onSpeechStart = (event) => {
        console.log('onSpeechStart', event);
        setState({
            ...state,
            started: true
        });
    };

    const onSpeechRecognized = (event) => {
        console.log('onSpeechRecognized', event);
        setState({
            ...state,
            recognized: true
        });
    };

    const onSpeechEnd = (event) => {
        console.log('onSpeechEnd', event);
        setState({
            ...state,
            end: true
        });
    };

    const onSpeechError = (event) => {
        console.log('onSpeechError', event);
        setState({
            ...state,
            error: JSON.stringify(event.error)
        });
    };

    const onSpeechResults = (event) => {
        console.log('onSpeechResults', event);
        setState({
            ...state,
            results: event.value
        });
    };

    const onSpeechPartialResults = (event) => {
        console.log('onSpeechPartialResults', event);
        setState({
            ...state,
            partialResults: event.value
        });
    };

    const onSpeechVolumeChange = (event) => {
        console.log('onSpeechVolumeChange', event);
        setState({
            ...state,
            pitch: event.value
        })
    }


    const startRecognizing = async () => {
        setState({
            recognized: false,
            pitch: '',
            error: '',
            started: false,
            results: [],
            partialResults: [],
            end: false
        });

        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    const cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    const destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
    };

    setState({
        recognized: false,
        pitch: '',
        error: '',
        started: false,
        results: [],
        partialResults: [],
        end: false
    });
};

