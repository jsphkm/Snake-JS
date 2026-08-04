import {
    Text,
    View,
    Pressable,
    StyleSheet,
    Platform,
} from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";


export default function Index() {
    
    const [loaded] = useFonts({
        JetBrainsMonoNL: require("../../assets/fonts/JetBrainsMonoNL-Regular.ttf"),
    });
    const [screen, setScreen] = useState<"menu" | "playing">("menu");

    if (!loaded) return null;

    return (
    <View style={styles.page}>
        <View style={styles.board}>
            <Pressable
                accessibilityRole = "button"
                onPress={() => setScreen("playing")}
                style={({ pressed, hovered }) => [
                    styles.button,
                    hovered && { cursor: "pointer" },
                    pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.buttonLabel}>New Game</Text>
            </Pressable>
        </View>
    </View>
  );
}

const BOARD = 400;
const BUTTON_W = 160;
const BUTTON_H = 48;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
    page: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#eeeeee", // matches styles.css --bg-color light
    },
    board: {
      width: BOARD,
      height: BOARD,
      backgroundColor: "#dcdcdc", // p5 220
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
        cursor: "pointer",
      width: BUTTON_W,
      height: BUTTON_H,
      backgroundColor: "#000000",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonPressed: {
      backgroundColor: "#282828", // p5 fill(40)
    },
    buttonLabel: {
      color: "#ffffff",
      fontSize: 16,
      fontFamily: "JetBrainsMonoNL", // after expo-font load; or omit until then
    },
    hint: {
      marginTop: 28,
      color: "#000000",
      fontSize: 16,
      fontFamily: "JetBrainsMonoNL",
    }
});

