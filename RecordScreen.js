import React, { useEffect, useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Select from "./Select";
import { sharedStyles as styles } from "./theme";

const STAGES = [ "ボムタウン1(レインボー)","ボムタウン2.1","ボムタウン3.2","ボムタウン4.1","ボムタウン5.1",
  "ボムタウン6(レインボー)","ボムタウン7","ボムタウン8","パニックアイランド1.1","パニックアイランド2.2","パニックアイランド3","パニックアイランド4",
  "パニックアイランド5.2","パニックアイランド6","パニックアイランド(岩礁)","サイバースペース1.1","サイバースペース2","サイバースペース3.1","サイバースペース4",
  "サイバースペース5","サイバースペース(ヘキサタワー)","アクアブルー城1.1","アクアブルー城2","アクアブルー城3","アクアブルー城4","アクアブルー城5.1","アクアブルー城6",
  "聖邪の遺跡1.2","聖邪の遺跡2.1","聖邪の遺跡3","聖邪の遺跡(哀愁)","カラクリ城1","カラクリ城2.1","カラクリ城3","カラクリ城4.1","カラクリ城(たそがれ1.1)","カラクリ城(黎明)",
  "ヒエールビレッジ1","ヒエールビレッジ2","ヒエールビレッジ(雪解け)","ヒエールビレッジ(雪灯り)","ヒエールビレッジ(冬茜)","ボム砂漠1","ボム砂漠2","ボム砂漠3","ボム火山1","ボム火山2","ボム火山3" ];

const ROLES = ["ボマー","アタッカー","シューター","ブロッカー"];
const CHAR_BY_ROLE = {
  "ボマー":     ["シロ","クロ","藤崎詩織","グレイ","シロン","プラチナ","ダァク","シロヱ"],
  "アタッカー": ["オレン","ウルシ","セピア","アサギ","テッカ","チグサ","チアモ","スイスイ"],
  "シューター": ["エメラ","パプル","ツガル","パステル","オリーヴ","シルヴァ","ブラス"],
  "ブロッカー": ["モモコ","アクア","グリムアロエ","パイン","プルーン","メロン","ブルーベリー","ヒイロ"],
};

export default function RecordScreen({ addRecord }) {
  const [stage, setStage] = useState(STAGES[0]);
  const [role,  setRole]  = useState(ROLES[0]);

  const charOptions = useMemo(() => CHAR_BY_ROLE[role] ?? [], [role]);

  const [character, setCharacter] = useState(charOptions[0] ?? "");
  useEffect(() => {
    if (!charOptions.includes(character)) setCharacter(charOptions[0] ?? "");
  }, [charOptions, character]);

  const [result, setResult]       = useState("勝ち");
  const [playType, setPlayType]   = useState("アーケード");
  const [matchType, setMatchType] = useState("かけ");

  const onAdd = () => {
    addRecord({ ts: Date.now(), id: Date.now().toString(), date: new Date().toLocaleString(), stage, role, character, result, playType, matchType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ボンガクロ戦績記録</Text>

      <Select label="ステージ" value={stage} options={STAGES} onChange={setStage} />
      <Select label="ロール"   value={role}  options={ROLES}  onChange={setRole} />

      {/* デバッグ: 実際に渡される配列をログに出す */}
      {console.log("[DEBUG] role:", role, "charOptions:", charOptions)}

      <Select label="キャラ"   value={character} options={charOptions} onChange={setCharacter} />

      <Select label="勝敗" value={result} options={["勝ち","負け","引き分け"]} onChange={setResult} />
      <Select label="プレイ場所" value={playType} options={["アーケード","コナステ"]} onChange={setPlayType} />
      <Select label="マッチタイプ" value={matchType} options={["かけ","フル"]} onChange={setMatchType} />

      <View style={{ height: 12 }} />
      <View style={{ position:"absolute", left:16, right:16, bottom:24 }}>
        <Pressable style={styles.primaryBtn} onPress={onAdd}>
          <Text style={styles.primaryBtnText}>＋ 記録</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
