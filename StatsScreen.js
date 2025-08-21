import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Select from "./Select";

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
const CHAR_BY_ROLE = {
  "ボマー":     ["シロ","クロ","藤崎詩織","グレイ","シロン","プラチナ","ダァク","シロヱ"],
  "アタッカー": ["オレン","ウルシ","セピア","アサギ","テッカ","チグサ","チアモ","スイスイ"],
  "シューター": ["エメラ","パプル","ツガル","パステル","オリーヴ","シルヴァ","ブラス"],
  "ブロッカー": ["モモコ","アクア","グリムアロエ","パイン","プルーン","メロン","ブルーベリー","ヒイロ"],
};
const DATE_RANGES = ["すべて","今日","直近7日","直近30日"];

/* ===== 日付ユーティリティ（超頑丈） ===== */
function toMs(r){
  if (typeof r?.ts === "number") return r.ts;
  if (typeof r?.date === "number") return r.date;
  let s = (r?.date || "").trim();
  if (!s) return NaN;

  // 角括弧で囲まれていたら除去（"[8/21/2025, 7:30:36 AM]" 等）
  if (s[0]==="[" && s[s.length-1]==="]") s = s.slice(1,-1).trim();

  // 1) ISO 8601
  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return iso;

  // 2) "YYYY/MM/DD HH:mm[:ss]" / "YYYY-MM-DD HH:mm[:ss]" / "YYYY/MM/DD 午前 7:30[:ss]" 等
  let m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})[ T](?:午前|午後)?\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
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
function startOfTodayMs(){ const t = new Date(); t.setHours(0,0,0,0); return t.getTime(); }
function inRangeTs(ms, range){
  if (range === "すべて") return true;
  if (Number.isNaN(ms)) return false;
  const DAY = 24*60*60*1000;
  const today0 = startOfTodayMs();
  if (range === "今日")      return ms >= today0;
  if (range === "直近7日")   return ms >= (today0 - 6*DAY);   // 今日 + 過去6日
  if (range === "直近30日")  return ms >= (today0 - 29*DAY);  // 今日 + 過去29日
  return true;
}

/** props: { records:[], includeDrawsInStats:boolean } */
export default function StatsScreen({ records = [], includeDrawsInStats = true }) {
  const [fStage, setFStage] = useState("すべて");
  const [fRole,  setFRole]  = useState("すべて");
  const [fChar,  setFChar]  = useState("すべて");
  const [fDate,  setFDate]  = useState("すべて");

  const charCandidates = useMemo(() =>
    fRole === "すべて" ? ["すべて"] : ["すべて", ...(CHAR_BY_ROLE[fRole] ?? [])],
  [fRole]);

  // --- デバッグ: 先頭3件の日時解釈をログに出す（必要なければコメントアウトOK）
  console.log("[STATS] filter:", { fStage, fRole, fChar, fDate });
  records.slice(0,3).forEach((r,i)=>{
    const ms = toMs(r);
    console.log(`[STATS] sample#${i}`, r.date, "→", ms, "inRange:", inRangeTs(ms, fDate));
  });

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (fStage !== "すべて" && r.stage !== fStage) return false;
      if (fRole  !== "すべて" && r.role  !== fRole ) return false;
      if (fChar  !== "すべて" && r.character !== fChar) return false;
      const ms = toMs(r);
      if (!inRangeTs(ms, fDate)) return false;
      return true;
    });
  }, [records, fStage, fRole, fChar, fDate]);

  const { rows, totalMatches, totalWins, totalRate } = useMemo(() => {
    const map = new Map(); const data = [];
    const countable = (r) => includeDrawsInStats ? true : (r.result !== "引き分け");
    for (const r of filtered) {
      if (!countable(r)) continue;
      const key = `${r.character}__${r.stage}`;
      if (!map.has(key)) map.set(key, { character:r.character, stage:r.stage, matches:0, wins:0 });
      const obj = map.get(key); obj.matches += 1; if (r.result==="勝ち") obj.wins += 1;
    }
    const totMatches = filtered.filter(countable).length;
    const totWins    = filtered.filter(r=>r.result==="勝ち" && countable(r)).length;
    const totRate    = totMatches ? (totWins/totMatches)*100 : 0;
    for (const v of map.values()) data.push({ key:`${v.character}|${v.stage}`, ...v, rate: v.matches?(v.wins/v.matches)*100:0 });
    data.sort((a,b)=> (a.character===b.character) ? a.stage.localeCompare(b.stage,"ja") : a.character.localeCompare(b.character,"ja"));
    return { rows:data, totalMatches:totMatches, totalWins:totWins, totalRate:totRate };
  }, [filtered, includeDrawsInStats]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>勝敗集計</Text>

      <View style={s.filterBox}>
        <Select label="マップ"  value={fStage} options={["すべて", ...STAGES]} onChange={setFStage} />
        <Select label="ロール"  value={fRole}  options={["すべて", ...ROLES]}  onChange={(v)=>{ setFRole(v); setFChar("すべて"); }} />
        <Select label="キャラ"  value={fChar}   options={charCandidates} onChange={setFChar} />
        <Select label="日にち"  value={fDate}   options={DATE_RANGES} onChange={setFDate} />
      </View>

      <View style={s.summaryBar}>
        <Text style={s.summaryText}>試合数：{totalMatches}　勝利数：{totalWins}　勝率：{totalRate.toFixed(1)}%</Text>
      </View>

      <View style={s.tableWrapper}>
        <View style={[s.row, s.headerRow]}>
          <Text style={[s.cell, s.cellChar, s.headerText]}>使用ガール</Text>
          <Text style={[s.cell, s.cellStage, s.headerText]}>マップ</Text>
          <Text style={[s.cell, s.cellNum, s.headerText]}>試合数</Text>
          <Text style={[s.cell, s.cellNum, s.headerText]}>勝数</Text>
          <Text style={[s.cell, s.cellNum, s.headerText]}>勝率</Text>
        </View>

        <ScrollView>
          {rows.map((r, idx) => (
            <View key={r.key ?? idx} style={[s.row, idx % 2 === 1 && s.altRow]}>
              <Text style={[s.cell, s.cellChar]} numberOfLines={1}>{r.character}</Text>
              <Text style={[s.cell, s.cellStage]} numberOfLines={1}>{r.stage}</Text>
              <Text style={[s.cell, s.cellNum]}>{r.matches}</Text>
              <Text style={[s.cell, s.cellNum]}>{r.wins}</Text>
              <Text style={[s.cell, s.cellNum]}>{r.rate.toFixed(1)}%</Text>
            </View>
          ))}
          {rows.length === 0 && (
            <View style={[s.row, s.emptyRow]}><Text style={s.emptyText}>データがありません</Text></View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:"#F5F5F5" },
  title: { fontSize:18, fontWeight:"700", textAlign:"center", paddingTop:12, paddingBottom:8, color:"#111" },
  filterBox: { paddingHorizontal:12, paddingBottom:8 },
  summaryBar: { marginHorizontal:12, marginBottom:8, backgroundColor:"#E8F2FF", borderRadius:8, paddingVertical:8, paddingHorizontal:12, borderWidth:1, borderColor:"#CFE2FF" },
  summaryText: { color:"#0F3F8C", fontWeight:"700" },
  tableWrapper: { marginHorizontal:12, backgroundColor:"#FFFFFF", borderRadius:8, borderWidth:1, borderColor:"#E5E7EB", overflow:"hidden", flex:1 },
  headerRow: { backgroundColor:"#EBF3FF", borderBottomWidth:1, borderBottomColor:"#D6E4FF" },
  headerText: { fontWeight:"700", color:"#111" },
  row: { flexDirection:"row", alignItems:"center", minHeight:40, paddingHorizontal:8, borderBottomWidth:1, borderBottomColor:"#F0F0F0" },
  altRow: { backgroundColor:"#FAFAFA" },
  cell: { paddingVertical:6, paddingHorizontal:4, color:"#111" },
  cellChar: { flex:1.0 },
  cellStage:{ flex:1.6 },
  cellNum:  { width:64, textAlign:"right" },
  emptyRow:{ justifyContent:"center" },
  emptyText:{ color:"#666", fontStyle:"italic", paddingVertical:16, textAlign:"center", width:"100%" }
});
