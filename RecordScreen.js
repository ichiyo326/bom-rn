import React, { useState } from 'react';
import { Text, FlatList, Button, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { sharedStyles } from './theme';

export default function RecordScreen({ addRecord }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [stage, setStage] = useState(stageOptions[0]);
  const [character, setCharacter] = useState(characterOptions[0]);
  const [role, setRole] = useState(roleOptions[0]);
  const [result, setResult] = useState(resultOptions[0]);
  const [playType, setPlayType] = useState(playTypeOptions[0]);
  const [matchType, setMatchType] = useState(matchTypeOptions[0]);
  const [localRecords, setLocalRecords] = useState([]);

  const onAdd = () => {
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      stage,
      character,
      role,
      result,
      playType,
      matchType
    };
    addRecord(newRecord);
    setLocalRecords([newRecord, ...localRecords]);
  };

  return (
    <SafeAreaView style={[sharedStyles.container, isDark && sharedStyles.darkBackground]}>
      <Text style={[sharedStyles.title, isDark && sharedStyles.darkText]}>ボンガクロ戦績記録</Text>

      <Picker selectedValue={stage} onValueChange={setStage} style={sharedStyles.picker}>
        {stageOptions.map((s) => <Picker.Item key={s} label={s} value={s} />)}
      </Picker>

      <Picker selectedValue={role} onValueChange={setRole} style={sharedStyles.picker}>
        {roleOptions.map((r) => <Picker.Item key={r} label={r} value={r} />)}
      </Picker>

      <Picker selectedValue={character} onValueChange={setCharacter} style={sharedStyles.picker}>
        {characterOptions.map((c) => <Picker.Item key={c} label={c} value={c} />)}
      </Picker>

      <Picker selectedValue={result} onValueChange={setResult} style={sharedStyles.picker}>
        {resultOptions.map((r) => <Picker.Item key={r} label={r} value={r} />)}
      </Picker>

      <Picker selectedValue={playType} onValueChange={setPlayType} style={sharedStyles.picker}>
        {playTypeOptions.map((p) => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>

      <Picker selectedValue={matchType} onValueChange={setMatchType} style={sharedStyles.picker}>
        {matchTypeOptions.map((m) => <Picker.Item key={m} label={m} value={m} />)}
      </Picker>

      <Button title="＋ 記録" onPress={onAdd} />

      <FlatList
        data={localRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={sharedStyles.record}>
            [{item.date}] {item.stage} / {item.role} / {item.character} / {item.result} / {item.playType} / {item.matchType}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const stageOptions = [
  "ボムタウン1(レインボー)", "ボムタウン2.1", "ボムタウン3.2", "ボムタウン4.1",
  "ボムタウン5.1", "ボムタウン6(レインボー)", "ボムタウン7", "ボムタウン8",
  "パニックアイランド1.1", "パニックアイランド2.2", "パニックアイランド3", "パニックアイランド4",
  "パニックアイランド5.2", "パニックアイランド6", "パニックアイランド(岩礁)",
  "サイバースペース1.1", "サイバースペース2", "サイバースペース3.1", "サイバースペース4",
  "サイバースペース5", "サイバースペース(ヘキサタワー)", "アクアブルー城1.1",
  "アクアブルー城2", "アクアブルー城3", "アクアブルー城4", "アクアブルー城5.1",
  "アクアブルー城6", "聖邪の遺跡1.2", "聖邪の遺跡2.1", "聖邪の遺跡3", "聖邪の遺跡(哀愁)",
  "カラクリ城1", "カラクリ城2.1", "カラクリ城3", "カラクリ城4.1",
  "カラクリ城(たそがれ1.1)", "カラクリ城(黎明)", "ヒエールビレッジ1", "ヒエールビレッジ2",
  "ヒエールビレッジ(雪解け)", "ヒエールビレッジ(雪灯り)", "ヒエールビレッジ(冬茜)",
  "ボム砂漠1", "ボム砂漠2", "ボム砂漠3", "ボム火山1", "ボム火山2", "ボム火山3"
];

const roleOptions = ["ボマー", "アタッカー", "シューター", "ブロッカー"];

const characterOptions = [
  "シロ", "クロ", "藤崎詩織", "グレイ", "シロン", "プラチナ", "ダァク", "シロヱ",
  "オレン", "ウルシ", "セピア", "アサギ", "テッカ", "チグサ", "チアモ", "スイスイ",
  "エメラ", "パプル", "ツガル", "パステル", "オリーヴ", "シルヴァ", "ブラス",
  "モモコ", "アクア", "グリムアロエ", "パイン", "プルーン", "メロン", "ブルーベリー", "ヒイロ"
];

const resultOptions = ["勝ち", "負け", "引き分け"];
const playTypeOptions = ["アーケード", "コナステ"];
const matchTypeOptions = ["かけ", "フル"];
