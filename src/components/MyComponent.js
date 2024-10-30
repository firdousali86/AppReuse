// src/MyComponent.js
import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
// import { THE_SECRET } from "@env";
import { someSecret } from "../config";

const MyComponent = () => {
  useEffect(() => {
    console.log("===============");
    console.log(someSecret);
    console.log("===============");
  }, []);

  return (
    <View>
      <Text style={{ color: "white" }}>Reusable Component</Text>
    </View>
  );
};

export default MyComponent;
