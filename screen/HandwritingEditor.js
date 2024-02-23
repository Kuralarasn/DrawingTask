import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Image, Modal, Share, Platform, PermissionsAndroid } from 'react-native';
import { Svg, Path } from 'react-native-svg';;
import RNFS from 'react-native-fs';
import ViewShot from "react-native-view-shot";
import { captureRef } from 'react-native-view-shot';
const HandWritingEditor = () => {
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
    const penciltype = [
        { key: 0, value: require('../screen/img/color-pencil.png') },
        { key: 1, value: require('../screen/img/pen-tool.png') },

    ]
    const colortype = [
        { key: 0, value: '#FF0000' },
        { key: 1, value: '#000000' },
        { key: 2, value: '#008000' },
        { key: 3, value: '#0000FF' },

    ]

    const [colordata, setcolordata] = useState(colortype)
    const [data, setdata] = useState(image1)
    const [data2, setdata2] = useState(image2)
    const [type, setType] = useState(2)
    const [typeData, setTypeData] = useState(penciltype)
    const [paths, setPaths] = useState([]);
    const [currentColor, setCurrentColor] = useState('black');
    const [currentType, setCurrentType] = useState('round');
    const [isEraserMode, setEraserMode] = useState(false);
    const [redoStack, setRedoStack] = useState([]);
    const svgRef = useRef(null);
    const viewShotRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        requestStoragePermission();
    }, []);

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'This app needs access to your storage to save files.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const handleDrawStart = ({ nativeEvent }) => {
        const { locationX, locationY } = nativeEvent;
        setPaths([...paths, { color: currentColor, type: currentType, d: `M${locationX},${locationY}` }]);
    };

    const handleDrawMove = ({ nativeEvent }) => {
        if (paths.length > 0) {
            const { locationX, locationY } = nativeEvent;
            const lastPath = paths.pop();
            const updatedPath = { ...lastPath, d: `${lastPath.d} L${locationX},${locationY}` };
            setPaths([...paths, updatedPath]);
        }
    };


    const onPressBottom = (key) => {
        console.log(key, "check data");
        if (key == 0) {
            setModalVisible(!modalVisible)
        }
        if (key == 1) {
            setPaths([]);
            setEraserMode(!isEraserMode)
        }
        if (key == 2) {
            setModalVisible2(!modalVisible2)
        }
    }

    const onPressTop = async (key) => {
        if (key == 0) {
            if (paths.length > 0) {
                const lastPath = paths.pop();
                setRedoStack([...redoStack, lastPath]);
                setPaths([...paths]);
            }
        }
        if (key == 1) {

            if (redoStack.length > 0) {
                const lastRedoPath = redoStack.pop();
                setPaths([...paths, lastRedoPath]);
                setRedoStack([...redoStack]);
            }

        }
        if (key == 2) {
            try {
                const uri = await viewShotRef.current.capture();
                const fileName = `${Date.now()}.svg`;
                const filePath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
                await RNFS.copyFile(uri, filePath);
               
                const ur = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 1,
                });
                console.log(ur,"share image");
                // Share the captured image
                await Share.share({
                    message: ur,
                    url: ur,
                });
                setImageUri(filePath);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
        if (key == 3) {
            try {
                const uri = await viewShotRef.current.capture();
                const fileName = `${Date.now()}.png`;
                const filePath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
                await RNFS.copyFile(uri, filePath);
                console.log(uri, 'Saved as PNG:', filePath);
                setImageUri(filePath);
            } catch (error) {
                console.error('Save error:', error);
            }
        }
    }
    useEffect(() => {
        if (imageUri) {
            RNFS.exists(imageUri)
                .then((exists) => {
                    if (exists) {
                        console.log('Image exists:', imageUri);
                    } else {
                        console.warn('Image does not exist:', imageUri);
                    }
                })
                .catch((error) => console.error('File check error:', error));
        }
    }, [imageUri]);

    return (
        <View style={styles.container}>
            <View style={styles.topItems}>
                {data?.map((item, index) => {
                    return (
                        <TouchableOpacity key={item.key} style={styles.topTouch}
                            onPress={() => {
                                onPressTop(index)
                            }}>
                            <Image source={item?.value} style={styles.topImage} />
                        </TouchableOpacity>
                    )
                })}
            </View>
            <View style={{
                flex: 0.8,
                backgroundColor: 'white',

            }}>
                {imageUri && <View style={{
                    backgroundColor: 'white',
                    position: 'absolute ',
                    height: 150,
                    width: 150,
                    top: 0,
                    left: 0,
                    borderWidth: 1,
                    margin: 20,
                    elevation: 5,
                    borderColor: '#DEDEDE',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end'
                }}>
                    <Image source={{ uri: `file://${imageUri}` }} style={{ width: 150, height: 150 }} />
                </View>}
                <View >
                    <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
                        <Svg ref={svgRef} width="100%" height="100%" onTouchStart={handleDrawStart} onTouchMove={handleDrawMove}>
                            {paths.map((path, index) => (
                                <Path key={index} d={path.d} fill="none" stroke={path.color} strokeWidth={type} strokeLinecap={path.type} />
                            ))}
                        </Svg>
                    </ViewShot>
                </View>


            </View>
            <View style={[styles.topItems, { borderTopWidth: 1, borderTopColor: "#DEDEDE" }]}>
                {data2?.map((item, index) => {
                    return (
                        <TouchableOpacity key={item.key} style={styles.topTouch}
                            onPress={() => {
                                onPressBottom(index)
                            }}>
                            <Image source={item?.value} style={styles.topImage} />
                        </TouchableOpacity>
                    )
                })}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00000099',
                }}>
                    <View style={{
                        height: "10%",
                        width: "30%",
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        borderRadius: 5

                    }}>
                        {typeData?.map((item, index) => (
                            <TouchableOpacity key={item.key} onPress={() => {
                                if (index == 0) {
                                    setType(3)
                                    setModalVisible(false)
                                } else if (index == 1) {
                                    setType(1)
                                    setModalVisible(false)
                                }
                            }}>
                                <Image source={item?.value} style={{
                                    height: 30,
                                    width: 30
                                }} />
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>

            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible2);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#00000099',
                }}>
                    <View style={{
                        height: "10%",
                        width: "70%",
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        borderRadius: 5

                    }}>
                        {colordata?.map((item, index) => (
                            <TouchableOpacity key={item.key} style={{
                                backgroundColor: item.value,
                                height: 30,
                                width: 30,
                            }} onPress={() => {
                                setCurrentColor(item?.value)
                                setModalVisible2(!modalVisible2)
                            }}>

                            </TouchableOpacity>
                        ))}
                    </View>

                </View>

            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
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
});

export default HandWritingEditor;
