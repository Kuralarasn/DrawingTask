import React, { useState, useRef } from "react";
import { View, Image, Text, SafeareaView, TouchableOpacity, StyleSheet, PanResponder, Dimensions } from 'react-native'
import { Svg, Path } from 'react-native-svg';


const { height, width } = Dimensions.get('window')
const DrawingCanvas = () => {
  const image1 = [
    { key: 0, value: require('../screen/img/undo.png') },
    { key: 1, value: require('../screen/img/redo.png') },
    { key: 2, value: require('../screen/img/export.png') },
    { key: 3, value: require('../screen/img/download.png') }
  ]
  const image2 = [
    { key: 0, value: require('../screen/img/pencil.png') },
    { key: 1, value: require('../screen/img/eraser-tool.png') },
    { key: 2, value: require('../screen/img/color.png') },
  ]

  const [data, setdata] = useState(image1)
  const [data2, setdata2] = useState(image2)
  const [paths, setPaths] = useState([]);
  const [currentPath, setcurrentPath] = useState([])
  const [isClearButtonClicked, setClearButtonClicked] = useState(false)

  const onTouchEnd = () => {
    try {
      paths?.push(currentPath)
      console.log('====================================');
      console.log(currentPath);
      console.log('====================================');
      setcurrentPath([])
      setClearButtonClicked(false)
    } catch (error) {
      console.log(error, "toTouchEnd");
    }

  }

  const onTouchMove = (event) => {
    try {

      const newPath = [...currentPath];
      const locationX = event?.nativeEvent?.locationX;
      const locationY = event?.nativeEvent?.locationY;

      const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX?.toFixed(0)},${locationY?.toFixed(0)}`
      newPath?.push(newPoint);
      setcurrentPath(newPath)
    } catch (error) {
      console.log(error, "toTouchMove");
    }

  }

  const handleClearButtonClick = () => {
    setPaths([]);
    setcurrentPath([]);
    setClearButtonClicked(true)
  }

  // const pathRef = useRef('');

  // const handlePanResponderMove = (evt, gestureState) => {
  //   try {
  //     const { locationX, locationY } = gestureState;
  //     const path = pathRef.current + ` L ${locationX},${locationY}`;
  //     pathRef.current = path;
  //     setPaths([...paths, path]);
  //   } catch (error) {
  //     console.log('====================================');
  //     console.log(error);
  //     console.log('====================================');
  //   }

  // };

  // const panResponder = PanResponder.create({
  //   onStartShouldSetPanResponder: () => true,
  //   onMoveShouldSetPanResponder: () => true,
  //   onPanResponderMove: handlePanResponderMove,
  //   onPanResponderRelease: () => {
  //     pathRef.current = '';
  //   },
  // });

  return (

    <View style={styles.container}>
      <View style={styles.topItems}>
        {data?.map((item, index) => {
          return (
            <TouchableOpacity key={item.key} style={styles.topTouch}>
              <Image source={item?.value} style={styles.topImage} />
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={{
        flex: 0.8,
        backgroundColor: 'white',
        height: height * 0.7,
        width
      }} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        <Svg>
          <Path
            d={paths.join('')}
            stroke={isClearButtonClicked ? 'transparent' : 'red'}
            fill={'transparent'}
            strokeWidth={3}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
          {paths.map((item, index) => (
            <Path
              key={`path-${index}`}
              d={currentPath.join('')}
              stroke={isClearButtonClicked ? 'transparent' : 'red'}
              fill={'transparent'}
              strokeWidth={3}
              strokeLinejoin={'round'}
              strokeLinecap={'round'}
            />
          ))}
        </Svg>

      </View>
      <View style={[styles.topItems, { borderTopWidth: 1, borderTopColor: "#DEDEDE" }]}>
        {data2?.map((item, index) => {
          return (
            <TouchableOpacity key={item.key} style={styles.topTouch} onPress={handleClearButtonClick}>
              <Image source={item?.value} style={styles.topImage} />
            </TouchableOpacity>
          )
        })}
      </View>

    </View>
  )

}

export default DrawingCanvas

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topItems: {
    flex: 0.1,
    backgroundColor: 'white',
    borderBottomColor: '#DEDEDE',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center'
  },
  topTouch: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  topImage: {
    width: 20,
    height: 20
  }

})


