import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RecordScreen from "./RecordScreen";
import HistoryScreen from "./HistoryScreen";
import StatsScreen from "./StatsScreen";
import SettingsScreen from "./SettingsScreen";
import ExportScreen from "./ExportScreen";

SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();

/* ===== robust な date→ms 変換（StatsScreen と同等） ===== */
function toMs(r){
  if (typeof r?.ts === "number") return r.ts;
  if (typeof r?.date === "number") return r.date;
  const s = (r?.date || "").trim();
  if (!s) return NaN;

  // 1) ISO 8601
  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return iso;

  // 2) "YYYY/MM/DD HH:mm[:ss]"
  let m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (m) {
    const [_,y,mo,d,h,mi,sc] = m;
    return new Date(Number(y), Number(mo)-1, Number(d), Number(h), Number(mi), Number(sc||"0")).getTime();
  }

  // 3) "M/D/YYYY, h:mm[:ss] AM/PM"
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (m) {
    let [_, mo, d, y, h, mi, sc, ap] = m;
    let hh = Number(h);
    if (/PM/i.test(ap) && hh < 12) hh += 12;
    if (/AM/i.test(ap) && hh === 12) hh = 0;
    return new Date(Number(y), Number(mo)-1, Number(d), hh, Number(mi), Number(sc||"0")).getTime();
  }
  return NaN;
}

export default function App() {
  const [records, setRecords] = useState([]);
  const [includeDrawsInStats, setIncludeDrawsInStats] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem("records");
        if (json) {
          const raw = JSON.parse(json);
          // ★ マイグレーション：ts を付与
          const migrated = raw.map((r) => {
            const ms = toMs(r);
            return (typeof r.ts === "number")
              ? r
              : { ...r, ts: Number.isNaN(ms) ? Date.now() : ms };
          });
          setRecords(migrated);
          // 既存に ts が無かった場合は書き戻す（幾分安全に）
          const hadNoTs = raw.some((r) => typeof r.ts !== "number");
          if (hadNoTs) {
            await AsyncStorage.setItem("records", JSON.stringify(migrated));
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const onReady = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  const saveRecords = async (next) => {
    setRecords(next);
    try { await AsyncStorage.setItem("records", JSON.stringify(next)); } catch {}
  };
  const addRecord    = (r)  => saveRecords([{ ...r, ts: r?.ts ?? Date.now() }, ...records]);
  const deleteRecord = (id) => saveRecords(records.filter(x => x.id !== id));

  if (!ready) return null;

  return (
    <NavigationContainer onReady={onReady}>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = { "記録":"pencil", "履歴":"list", "集計":"stats-chart", "設定":"settings", "エクスポート":"cloud-upload" };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        }})}
      >
        <Tab.Screen name="記録" options={{ headerShown:false }}>{() => <RecordScreen addRecord={addRecord} />}</Tab.Screen>
        <Tab.Screen name="履歴" options={{ headerShown:false }}>{() => <HistoryScreen records={records} deleteRecord={deleteRecord} />}</Tab.Screen>
        <Tab.Screen name="集計" options={{ headerShown:false }}>{() => <StatsScreen records={records} includeDrawsInStats={includeDrawsInStats} />}</Tab.Screen>
        <Tab.Screen name="設定" options={{ headerShown:false }}>{() => <SettingsScreen includeDrawsInStats={includeDrawsInStats} setIncludeDrawsInStats={setIncludeDrawsInStats} />}</Tab.Screen>
        <Tab.Screen name="エクスポート" options={{ headerShown:false }}>{() => <ExportScreen records={records} />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
