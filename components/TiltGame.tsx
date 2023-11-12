import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    useAnimatedGestureHandler,
    AnimatedStyleProp,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import type { GestureHandlerContext } from "../types/GestureHandlerContext"
import { calculateBallSize, calculateX, calculateY } from '../functions/TiltGame';

const { width, height } = Dimensions.get('window');

const TiltGame = () => {
    const [toggleSizeBig, setToggleSizeBig] = useState(false);
    const [gyroscope, setGyroscope] = useState({ xPosition: 0, yPosition: 0 })
    const translateX = useSharedValue(width / 2 - 25);
    const translateY = useSharedValue(height / 2 - 25);
    const ballSize = useMemo(() => calculateBallSize(toggleSizeBig, width), [toggleSizeBig, width]);
    const boundX = useMemo(() => calculateX(gyroscope.xPosition, width), [gyroscope.xPosition, width])
    const boundY = useMemo(() => calculateY(gyroscope.yPosition, height), [gyroscope.yPosition, height])

    useEffect(() => {
        Gyroscope.addListener(({ x, y }) => {
            setGyroscope({ xPosition: translateX.value + y * 20, yPosition: translateY.value + x * 20 })
        });
        Gyroscope.setUpdateInterval(16);

        return () => {
            Gyroscope.removeAllListeners();
        };
    }, [translateX.value, translateY.value]);

    useEffect(() => {
        if (boundX) {
            translateX.value = boundX;
        }
    }, [boundX])

    useEffect(() => {
        if (boundY) {
            translateY.value = boundY;
        }
    }, [boundY])

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureHandlerContext>({
        onStart: (_, context) => {
            context.startX = translateX.value;
            context.startY = translateY.value;
        },
        onActive: (event, context) => {
            setGyroscope({ xPosition: context.startX - event.translationX, yPosition: context.startY + event.translationY })
        },
    });

    const ballStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(translateX.value) },
                { translateY: withSpring(translateY.value) },
            ],
        } as AnimatedStyleProp<ViewStyle>;
    });

    return (
        <View style={styles.container}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[{ ...styles.ball, width: ballSize, height: ballSize, borderRadius: ballSize }, ballStyle]} />
            </PanGestureHandler>
            <TouchableOpacity onPress={() => setToggleSizeBig((prev) => !prev)} style={styles.button}>
                <Text style={styles.buttonText}>Toggle size</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#2E2D4D",
    },
    ball: {
        width: 50,
        height: 50,
        backgroundColor: '#CB48B7',
        borderRadius: 25,
    },
    button: {
        bottom: 0,
        right: 0,
        left: 0,
        position: "absolute",
        padding: 20,
    },
    buttonText: {
        color: "#E4E3D3",
        alignSelf: "center"
    }
});

export default TiltGame;
