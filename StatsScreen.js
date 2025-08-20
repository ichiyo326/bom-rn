import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { sharedStyles } from './theme';

export default function StatsScreen({ records, includeDrawsInStats }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const filtered = includeDrawsInStats
    ? records
    : records.filter(r => r.result !== '引き分け');

  const countMap = {};
  for (const r of filtered) {
    const key = `${r.stage} > ${r.role} > ${r.character}`;
    countMap[key] ??= { win: 0, lose: 0, draw: 0 };
    if (r.result === '勝ち') countMap[key].win++;
    else if (r.result === '負け') countMap[key].lose++;
    else countMap[key].draw++;
  }

  const stats = Object.entries(countMap).map(([key, val]) => {
    const total = val.win + val.lose + val.draw;
    const winrate = total ? ((val.win / total) * 100).toFixed(1) : '0.0';
    return `${key}：${val.win}勝 ${val.lose}敗${includeDrawsInStats ? ` ${val.draw}分` : ''}（勝率${winrate}%）`;
  });

  return (
    <View style={[sharedStyles.container, isDark && sharedStyles.darkBackground]}>
      <Text style={[sharedStyles.title, isDark && sharedStyles.darkText]}>勝敗集計</Text>
      {stats.map((line, idx) => (
        <Text key={idx} style={sharedStyles.record}>{line}</Text>
      ))}
    </View>
  );
}
