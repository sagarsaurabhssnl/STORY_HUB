import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, ToastAndroid, Vibration } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Icon } from "react-native-elements";
import * as Device from 'expo-device';
import db from "../config"

export default function write() {
    const [story, setstory] = useState("");
    const [moral, setmoral] = useState("");
    const [author, setauthor] = useState("");
    const [deviceId, setdeviceId] = useState("");

    function submit() {
        save("story", story);
        save("moral", moral);
        save("author", author);
    }

    async function updateDatabase() {
        if (story) {
            await db.collection("userStories").add({ story: story, moral: moral, author: author, deviceId: deviceId });
            setstory("");
            setauthor("");
            setmoral("")
            Vibration.vibrate();
            ToastAndroid.showWithGravity(
                "Story Uploaded",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        } else {
            Vibration.vibrate();
            ToastAndroid.showWithGravity(
                "Story cannot be empty",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
        await updateDatabase();
    }

    async function fetchDEviceId() {
        await setdeviceId(Device.osBuildId);
    }

    useEffect(() => {
        fetchDEviceId();
    }, [])

    return (
        <View style={{ backgroundColor: "#242424", width: "100%", height: "100%" }}>
            <ScrollView
                contentContainerStyle={styles.container}>
                <View enabled={false} keyboardVerticalOffset={0} style={[styles.textContainer, { width: "90%" }]} behavior={"position"}>
                    <TextInput value={author} placeholder={"Author"} style={[styles.inputStory, { height: 40 }]} onChangeText={(val) => { setauthor(val) }} maxLength={50} />
                    <Icon
                        reverse
                        reverseColor={"#000"}
                        name='x-circle'
                        type='feather'
                        color='#00000000'
                        onPress={() => { setauthor("") }}
                        containerStyle={{ position: "absolute", zIndex: 1, alignSelf: "flex-end", transform: [{ translateX: -0 }, { translateY: 0 }] }} />
                </View>
                <View style={{ alignSelf: "flex-end", marginRight: 20, backgroundColor: "#ccc", padding: 5, borderRadius: 5 }}>
                    <Text>{author.length}/50</Text>
                </View>
                <View style={[styles.textContainer, { width: "90%" }]} behavior={"position"}>
                    <TextInput value={moral} placeholder={"Moral of the story"} style={[styles.inputStory, { height: 40 }]} onChangeText={(val) => { setmoral(val) }} maxLength={50} />
                    <Icon
                        reverse
                        reverseColor={"#000"}
                        name='x-circle'
                        type='feather'
                        color='#00000000'
                        onPress={() => { setmoral("") }}
                        containerStyle={{ position: "absolute", zIndex: 1, alignSelf: "flex-end", transform: [{ translateX: -0 }, { translateY: 0 }] }} />
                </View>
                <View style={{ alignSelf: "flex-end", marginRight: 20, backgroundColor: "#ccc", padding: 5, borderRadius: 5 }}>
                    <Text>{moral.length}/50</Text>
                </View>
                <View style={[styles.textContainer, { width: "90%" }]} behavior={"position"}>
                    <TextInput multiline={true} value={story} placeholder={"Story Here"} style={styles.inputStory} onChangeText={(val) => { setstory(val) }} maxLength={10000} />
                    <Icon
                        reverse
                        reverseColor={"#000"}
                        name='x-circle'
                        type='feather'
                        color='#00000000'
                        onPress={() => { setstory("") }}
                        containerStyle={{ position: "absolute", zIndex: 1, alignSelf: "flex-end", transform: [{ translateX: -0 }, { translateY: 0 }] }} />
                </View>
                <View style={{ alignSelf: "flex-end", marginRight: 20, backgroundColor: "#ccc", padding: 5, borderRadius: 5 }}>
                    <Text>{story.length}/10000</Text>
                </View>
                <TouchableOpacity style={{ elevation: 2, padding: 10, backgroundColor: "#000", borderRadius: 6 }} onPress={() => { submit() }}><Text style={{ color: "#fff" }}>SUBMIT</Text></TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 10
    }, inputStory: {
        width: "80%",
        height: 200,
        borderRadius: 6,
        textAlign: "center"
    },
    textContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "#6E6E6E",
        margin: 20,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    }
});
