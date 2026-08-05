import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme-context";
type Props = {
    score: number; hiScore: number; width: number;
};

function formatScore(n: number) {
  return n.toLocaleString("en-US");
}

export function ScoreHud({ score, hiScore, width }: Props) {
  const { colors, typography } = useTheme();
  const font = { fontFamily: typography.fontFamily, color: colors.hint };

  return (
    <View style={[styles.wrap, { width }]}>
      <View style={styles.col}>
        <Text style={[styles.label, font]}>PLAYER</Text>
        <Text style={[styles.value, font, { fontSize: typography.body }]}>
          {formatScore(score)}
        </Text>
      </View>
      <View style={[styles.col, styles.colCenter]}>
        <Text style={[styles.label, font]}>HIGH SCORE</Text>
        <Text style={[styles.value, font, { fontSize: typography.body }]}>
          {formatScore(hiScore)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 44,
    userSelect: "none",
  },
  col: {
    minWidth: 96,
  },
  colCenter: {
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    letterSpacing: 1,
    opacity: 0.7,
    userSelect: "none",
  },
  value: {
    marginTop: 2,
    userSelect: "none",
  },
});
