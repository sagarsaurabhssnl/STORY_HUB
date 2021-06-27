import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, SafeAreaView } from 'react-native';
import { Icon } from "react-native-elements";
import * as Device from 'expo-device';
import localstory from "../story";
import db from "../config"

export default function read() {

    const [contentType, setcontentType] = useState(true);
    const [Story, setStory] = useState([]);
    const [moral, setmoral] = useState([]);
    const [author, setauthor] = useState([]);
    const [refreshed, setrefreshed] = useState(false)
    const [randomStory, setrandomStory] = useState(Math.round(Math.random() * 6));
    const [deviceId, setdeviceId] = useState("");
    const [refStoryIndex, setrefStoryIndex] = useState(0);

    function refresh() {
        setrandomStory(Math.round(Math.random() * 6) + 1);
    }

    function checkStory(data) {

        let check = false;
        if (Story.length === 0) {
            check = true;
        }
        else {
            Story.map((stories) => {
                // console.log(stories);
                if (data.story !== stories) {
                    check = true;
                }
            });
        }
        // console.log("-------------------------------------------------------------------------");
        // console.log("story " + check);
        return (check);
    }

    function checkAuthor(data) {
        let check = false;
        if (author.length === 0) {
            check = true;
        }
        else {
            author.map((stories) => {
                if (data.author !== stories) {
                    check = true;
                }
            });
        }

        // console.log("author " + check);
        return (check);
    }

    function checkMoral(data) {
        let check = false;
        if (author.length === 0) {
            check = true;
        }
        else {
            moral.map((stories) => {
                if (data.moral !== stories) {
                    check = true;
                }
            });
        }
        // console.log("moral " + check);
        return (check);
    }

    async function fetchStory() {
        // setrefreshed(false);
        const databaseRef = await db.collection("userStories").where('deviceId', '==', deviceId).limit(15).get();
        // setqueryRef(await db.collection("userStories").where('deviceId', '==', deviceId).limit(10).get());
        // console.log(databaseRef);
        // console.log(databaseRef.docs.length);
        if (databaseRef.docs.length == 0) {
            // console.log("0 length");
            ToastAndroid.showWithGravity(
                "You haven't uploaded any story yet.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        } else {
            databaseRef.docs.map((doc, index) => {
                if (checkStory(databaseRef.docs[index].data()) && checkMoral(databaseRef.docs[index].data()) && checkAuthor(databaseRef.docs[index].data())) {
                    // console.log("if else true 1");
                    var databaseStory = Story;
                    var databaseAuthor = author;
                    var databaseMoral = moral;
                    // console.log("if else true 2");
                    databaseStory.push(databaseRef.docs[index].data().story);
                    // console.log("if else true 3");
                    // console.log(databaseRef.docs[index].data().author);
                    if (databaseRef.docs[index].data().author) {
                        databaseAuthor.push(databaseRef.docs[index].data().author);
                    } else {
                        databaseAuthor.push("__")
                    }
                    if (databaseRef.docs[index].data().moral) {
                        databaseMoral.push(databaseRef.docs[index].data().moral)
                    } else {
                        databaseMoral.push("__")
                    }
                    // console.log("if else true 4");
                    setStory(databaseStory);
                    setmoral(databaseAuthor);
                    setauthor(databaseMoral);
                    // console.log("if else true 5");
                    // console.log(databaseAuthor)
                    // console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
            })
        }
        setrefreshed(true);
    }

    // useEffect(() => {
    //     if (queryRef.docs.length !== 0) {
    // console.log("no stories");
    //     } else {
    //         var docs = queryRef.docs.data();
    //         setStory([...queryRef.docs[0].data().story]);
    // console.log(Story[0]);
    //     }
    //     setrefreshed(true);
    // }, [queryRef]);

    async function intialize() {
        await setdeviceId(Device.osBuildId);
    }

    function refreshDatabaseData() {
        // console.log(Story.length);
        // console.log(Story);
        setrefStoryIndex(Math.round(Math.random() * Story.length));
        // console.log(refStoryIndex);
    }

    useEffect(() => {
        if (deviceId) {
            fetchStory("a");
        }
    }, [deviceId]);

    useEffect(() => {
        intialize();
    }, []);

    return (
        <View style={{ width: "100%", height: "100%", backgroundColor: "#242424", }}>
            {refreshed ? (
                Story.length !== 0 && contentType ? (
                    <ScrollView scrollEnabled contentContainerStyle={styles.container} keyboardDismissMode={"on-drag"}>
                        <View style={{ backgroundColor: "#ca9", borderRadius: 10, margin: 40, padding: 20 }}>
                            <Text style={{ fontSize: 19 }}>{Story[refStoryIndex]}</Text>
                            {moral ? (<Text style={{ color: "#060" }}>{"\n"}Moral: {moral[refStoryIndex]}</Text>) : (<View />)}
                            {author ? (
                                <Text style={{ alignSelf: "flex-end", color: "#555" }}>Author: {author[refStoryIndex]}</Text>
                            ) : (
                                <View />
                            )}
                        </View>
                        <TouchableOpacity onPress={() => { setcontentType(false); }} style={{ elevation: 2, backgroundColor: "#000", padding: 10, borderRadius: 6 }}>
                            <Text style={{ color: "#fff" }}>LOCAL STORIES</Text>
                        </TouchableOpacity>
                        <Icon
                            raised
                            brand
                            reverse
                            reverseColor={"#fff"}
                            name='refresh'
                            type='font-awesome'
                            color='#257D00'
                            onPress={() => { refreshDatabaseData() }}
                            containerStyle={{ elevation: 2, position: "absolute", zIndex: 1, alignSelf: "flex-end", transform: [{ translateX: -30 }, { translateY: 40 }] }} />
                    </ScrollView>
                )
                    : (
                        <View>
                            <ScrollView scrollEnabled contentContainerStyle={styles.container} keyboardDismissMode={"on-drag"}>
                                <View style={{ backgroundColor: "#ca9", borderRadius: 10, margin: 40, padding: 20 }}>
                                    <Text style={{ fontSize: 19 }}>{localstory[randomStory].story}</Text>
                                    <Text style={{ color: "#060" }}>{"\n"}Moral: {localstory[randomStory].moral}</Text>
                                    {localstory[randomStory].author ? (
                                        <Text style={{ alignSelf: "flex-end", color: "#555" }}>Author: {localstory[randomStory].author}</Text>
                                    ) : (
                                        <View />
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => { fetchStory("b"); setcontentType(true); }} style={{
                                    elevation: 2, backgroundColor: "#000", padding: 10, borderRadius: 6
                                }}>
                                    <Text style={{ color: "#fff" }}>MY STORIES</Text>
                                </TouchableOpacity>
                            </ScrollView>
                            <Icon
                                raised
                                brand
                                reverse
                                reverseColor={"#fff"}
                                name='refresh'
                                type='font-awesome'
                                color='#257D00'
                                onPress={() => { refresh() }}
                                containerStyle={{ elevation: 2, position: "absolute", zIndex: 1, alignSelf: "flex-end", transform: [{ translateX: -30 }, { translateY: 40 }] }} />
                        </View>
                    )) : (
                <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#242424" }} >
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>)}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 80,
    },
});
