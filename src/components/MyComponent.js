// src/MyComponent.js
import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
// import { THE_SECRET } from "@env";
// import { someSecret } from "../config";
import Config from "react-native-config";

const MyComponent = () => {
  useEffect(() => {
    console.log("===============");
    console.log(Config.THE_SECRET);
    console.log(Config.ANOTHER_SECRET);
    // console.log(someSecret);
    console.log("===============");
  }, []);

  return (
    <View>
      <Text style={{ color: "white" }}>Reusable Component</Text>
    </View>
  );
};

export default MyComponent;
