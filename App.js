import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimension } from 'react-native'
import HandwritingEditor from "./screen/HandwritingEditor";
import DrawingCanvas from "./screen/DrawingCanvas";
import DrawingApp from "./screen/HandwritingEditor";
const App = () => {




  return (
    <View style={{
      flex:1
    }}>
      <DrawingApp />
    </View>


  )

}

export default App

const styles = StyleSheet.create({


})


