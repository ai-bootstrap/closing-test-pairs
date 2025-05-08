import React from "react";
import LottieView from "lottie-react-native";

export default function NodataLottie() {
  return (
    <LottieView
      source={require("./nodata.json")}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
    />
  );
}