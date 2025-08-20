// theme.js
import { StyleSheet } from "react-native";

/** ここだけを Figma の値に合わせて変えれば、全画面が一斉に反映されます */
export const theme = {
  color: {
    bg: "#F9F9F9",      // 背景色
    text: "#333333",    // 文字色
    card: "#FFFFFF",    // カード背景
    primary: "#1678FF", // プライマリ（ボタンなど）
    danger: "#E03D3D",  // 削除など
  },
  space: { xs: 8, s: 12, m: 16, l: 20 }, // 余白
  radius: { md: 12 },                     // 角丸
  font: { title: 20, body: 14 },          // フォントサイズ
};

/** 画面共通スタイル（各画面から sharedStyles をそのまま使えます） */
export const sharedStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.space.l,
    paddingTop: theme.space.l + 12,
    paddingBottom: theme.space.l * 2,
    backgroundColor: theme.color.bg,
    flexGrow: 1,
  },
  title: {
    fontSize: theme.font.title,
    fontWeight: "700",
    color: theme.color.text,
    textAlign: "center",
    marginBottom: theme.space.m,
  },
  card: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.md,
    padding: theme.space.m,
    marginBottom: theme.space.m,
    // カード感（Android用の影）
    elevation: 2,
    // iOS影（必要なら）
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  record: {
    fontSize: theme.font.body,
    color: theme.color.text,
  },
  primaryBtn: {
    backgroundColor: theme.color.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  // ダークテーマ用（必要な画面で condition 付きで併用してください）
  darkBackground: { backgroundColor: "#121212" },
  darkText: { color: "#f2f2f2" },

  // 入力系(Picker)の見た目統一に使うなら
  picker: {
    height: 48,
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: theme.space.s,
  },

  spacerS: { height: theme.space.s },
  spacerM: { height: theme.space.m },
});
