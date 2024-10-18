import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/auth";

export const AuthContext = createContext();

let isWithHeld = false;

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);

    // Unsubscribe from the listener when unmounting
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      isWithHeld = false;
    }
  }, [user]);

  const onAuthStateChanged = (user) => {
    if (user?._user?.displayName && !isWithHeld) {
      setUser(user);
    }
    setLoading(false);
  };

  // Sign up function
  const signUp = async (email, password, name) => {
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      await userCredential.user.updateProfile({ displayName: name });
      // setUser(userCredential.user);

      signOut();
      setLoading(false);
    } catch (error) {
      console.error("Error during sign up:", error);

      setLoading(false);
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email, password, presentedUdid) => {
    setLoading(true);

    isWithHeld = true;

    try {
      // Step 1: Sign in with Firebase Authentication to get the UID
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      const uid = userCredential.user.uid;

      // Step 2: Fetch user device data from Firestore
      const userDeviceDoc = await firestore()
        .collection("userDevices")
        .doc(uid)
        .get();

      setLoading(false);

      if (!userDeviceDoc.exists) {
        // First time sign-in for this UID, bind the presented UDID
        await firestore().collection("userDevices").doc(uid).set({
          currentUdid: presentedUdid,
          oldUdids: [],
          requestCount: 0,
          email,
          displayName: userCredential?.user?.displayName,
        });

        setUser(userCredential.user);

        return userCredential.user;
      }

      const userDeviceData = userDeviceDoc.data();

      if (
        userDeviceData.currentUdid === "" ||
        userDeviceData.currentUdid === presentedUdid
      ) {
        if (userDeviceData.currentUdid === "") {
          firestore().collection("userDevices").doc(uid).update({
            currentUdid: presentedUdid,
          });
        }

        setUser(userCredential.user);

        return userCredential.user;
      } else if (userDeviceData.currentUdid !== presentedUdid) {
        if (userDeviceData.oldUdids.includes(presentedUdid)) {
          signOut();

          Alert.alert(
            "Info",
            "You are Signing-In into your one of old devices, make sure to use this subscription in one device only. Raise a device update request and check again later.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Raise",
                onPress: () => {
                  raiseDeviceUpdateRequest(uid);
                },
              },
            ]
          );
        } else {
          signOut();
          Alert.alert(
            "Info",
            "You are Signing-In into with a new device, make sure to use this subscription in one device only. Raise a device update request and check again later.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Raise",
                onPress: () => {
                  raiseDeviceUpdateRequest(uid);
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
  };

  const raiseDeviceUpdateRequest = async (uid) => {
    firestore()
      .collection("userDevices")
      .doc(uid)
      .update({
        requestCount: firebase.firestore.FieldValue.increment(1),
      });
  };

  // Context value
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
