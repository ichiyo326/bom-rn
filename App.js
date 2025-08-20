import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import RecordScreen from './RecordScreen';
import StatsScreen from './StatsScreen';
import HistoryScreen from './HistoryScreen';
import SettingsScreen from './SettingsScreen';
import ExportScreen from './ExportScreen';

SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();

export default function App() {
  const [records, setRecords] = useState([]);
  const [includeDrawsInStats, setIncludeDrawsInStats] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const json = await AsyncStorage.getItem('records');
        if (json) {
          setRecords(JSON.parse(json));
        }
      } catch (e) {
        console.error('読み込み失敗', e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const saveRecords = async (newRecords) => {
    try {
      const json = JSON.stringify(newRecords);
      await AsyncStorage.setItem('records', json);
    } catch (e) {
      console.error('保存失敗', e);
    }
  };

  const addRecord = (newRecord) => {
    const newRecords = [newRecord, ...records];
    setRecords(newRecords);
    saveRecords(newRecords);
  };

  const deleteRecord = (id) => {
    const newRecords = records.filter((r) => r.id !== id);
    setRecords(newRecords);
    saveRecords(newRecords);
  };

  if (!appIsReady) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === '記録') icon = 'pencil';
            else if (route.name === '履歴') icon = 'list';
            else if (route.name === '集計') icon = 'stats-chart';
            else if (route.name === '設定') icon = 'settings';
            else if (route.name === 'エクスポート') icon = 'cloud-upload';
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="記録" options={{ headerShown: false }}>
          {() => <RecordScreen addRecord={addRecord} />}
        </Tab.Screen>
        <Tab.Screen name="履歴" options={{ headerShown: false }}>
          {() => <HistoryScreen records={records} deleteRecord={deleteRecord} />}
        </Tab.Screen>
        <Tab.Screen name="集計" options={{ headerShown: false }}>
          {() => <StatsScreen records={records} includeDrawsInStats={includeDrawsInStats} />}
        </Tab.Screen>
        <Tab.Screen name="設定" options={{ headerShown: false }}>
          {() => <SettingsScreen includeDrawsInStats={includeDrawsInStats} setIncludeDrawsInStats={setIncludeDrawsInStats} />}
        </Tab.Screen>
        <Tab.Screen name="エクスポート" options={{ headerShown: false }}>
          {() => <ExportScreen records={records} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
