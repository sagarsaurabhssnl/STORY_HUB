import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Linking } from "react-native";

export default function github({ navigation }) {
    useEffect(() => {
        console.log("mounted");
    }, [])
    return (
        <View style={{ backgroundColor: "#242424", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <TouchableOpacity onPress={() => { Linking.openURL("https://github.com/sagarsaurabhssnl/STORY_HUB") }} style={{ alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 10 }}>Redirect to</Text>
                <Text style={{ color: "#fff", fontSize: 20 }}>Source Code on Github</Text>

            </TouchableOpacity>
        </View>
    )
}