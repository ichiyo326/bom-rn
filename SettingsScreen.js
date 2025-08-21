import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles as styles } from './theme';

const ORDER_KEYS = { STAGE:'order_stages', ROLE:'order_roles', CHAR:'order_chars' };
const STAGES = [
  "ボムタウン1(レインボー)","ボムタウン2.1","ボムタウン3.2","ボムタウン4.1","ボムタウン5.1",
  "ボムタウン6(レインボー)","ボムタウン7","ボムタウン8",
  "パニックアイランド1.1","パニックアイランド2.2","パニックアイランド3","パニックアイランド4",
  "パニックアイランド5.2","パニックアイランド6","パニックアイランド(岩礁)",
  "サイバースペース1.1","サイバースペース2","サイバースペース3.1","サイバースペース4","サイバースペース5",
  "サイバースペース(ヘキサタワー)","アクアブルー城1.1","アクアブルー城2","アクアブルー城3","アクアブルー城4",
  "アクアブルー城5.1","アクアブルー城6","聖邪の遺跡1.2","聖邪の遺跡2.1","聖邪の遺跡3","聖邪の遺跡(哀愁)",
  "カラクリ城1","カラクリ城2.1","カラクリ城3","カラクリ城4.1","カラクリ城(たそがれ1.1)","カラクリ城(黎明)",
  "ヒエールビレッジ1","ヒエールビレッジ2","ヒエールビレッジ(雪解け)","ヒエールビレッジ(雪灯り)","ヒエールビレッジ(冬茜)",
  "ボム砂漠1","ボム砂漠2","ボム砂漠3","ボム火山1","ボム火山2","ボム火山3"
];
const ROLES = ["ボマー","アタッカー","シューター","ブロッカー"];
const CHARS = [
  "シロ","クロ","藤崎詩織","グレイ","シロン","プラチナ","ダァク","シロヱ",
  "オレン","ウルシ","セピア","アサギ","テッカ","チグサ","チアモ","スイスイ",
  "エメラ","パプル","ツガル","パステル","オリーヴ","シルヴァ","ブラス",
  "モモコ","アクア","グリムアロエ","パイン","プルーン","メロン","ブルーベリー","ヒイロ"
];

function OrderEditor({ title, base, storageKey }) {
  const [list, setList] = useState(base);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(storageKey);
      if (json) {
        const order = JSON.parse(json);
        const set = new Set(base);
        const head = order.filter(v => set.has(v));
        const tail = base.filter(v => !order.includes(v));
        setList([...head, ...tail]);
      }
    })();
  }, [storageKey]);

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    const a = [...list];
    [a[idx], a[j]] = [a[j], a[idx]];
    setList(a);
  };

  const save = async () => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(list));
    alert(`${title} の並び順を保存しました`);
  };

  const Item = ({ item, index }) => (
    <View style={{ flexDirection:'row', alignItems:'center', marginBottom:6 }}>
      <Text style={[styles.record, { flex:1 }]} numberOfLines={1}>{item}</Text>
      <Pressable onPress={() => move(index, -1)} style={{ paddingHorizontal:8, paddingVertical:6 }}><Text>↑</Text></Pressable>
      <Pressable onPress={() => move(index, 1)} style={{ paddingHorizontal:8, paddingVertical:6 }}><Text>↓</Text></Pressable>
    </View>
  );

  return (
    <View style={[styles.card, { marginTop:8 }]}>
      <Text style={{ fontWeight:'700', marginBottom:8 }}>{title} 並び替え</Text>
      <FlatList data={list} keyExtractor={(v)=>String(v)} renderItem={Item} />
      <View style={{ height:8 }} />
      <Pressable style={styles.primaryBtn} onPress={save}>
        <Text style={styles.primaryBtnText}>保存</Text>
      </Pressable>
    </View>
  );
}

export default function SettingsScreen({ includeDrawsInStats = true, setIncludeDrawsInStats = () => {} }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>

      {/* 例：引き分け集計トグル（既存互換） */}
      <View style={[styles.card, { flexDirection:'row', alignItems:'center', justifyContent:'space-between' }]}>
        <Text style={styles.record}>引き分けを集計に含める</Text>
        <Switch value={includeDrawsInStats} onValueChange={setIncludeDrawsInStats} />
      </View>

      <OrderEditor title="ステージ" base={STAGES} storageKey={ORDER_KEYS.STAGE} />
      <OrderEditor title="ロール"   base={ROLES}  storageKey={ORDER_KEYS.ROLE} />
      <OrderEditor title="キャラ"   base={CHARS}  storageKey={ORDER_KEYS.CHAR} />
    </View>
  );
}
