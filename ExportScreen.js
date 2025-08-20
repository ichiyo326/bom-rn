import React from 'react';
import { View, Text, Button, StyleSheet, Share, Alert, ScrollView, useColorScheme } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';

// この `sharedStyles` は他の画面（Record, Stats, History など）でも共通で使えるように構成されています。
import { sharedStyles } from './theme';

export default function ExportScreen({ records, setRecords }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark'; // この変数は dark mode スタイル適用のトリガーとして他画面でも共通パターンにできます。

  const exportToJson = async () => {
    try {
      const jsonString = JSON.stringify(records, null, 2);
      await Share.share({
        title: '戦績データ（JSON）',
        message: jsonString
      });
    } catch (e) {
      console.error('エクスポート失敗', e);
    }
  };

  const exportToCsv = async () => {
    try {
      const header = '日付,ステージ,ロール,キャラ,勝敗,プレイ場所,マッチタイプ';
      const rows = records.map(r => (
        [r.date, r.stage, r.role, r.character, r.result, r.playType, r.matchType].join(',')
      ));
      const csvString = [header, ...rows].join('\n');
      await Share.share({
        title: '戦績データ（CSV）',
        message: csvString
      });
    } catch (e) {
      console.error('CSVエクスポート失敗', e);
    }
  };

  const copyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(records, null, 2);
      await Clipboard.setStringAsync(jsonString);
      Alert.alert('クリップボード', 'JSON形式のデータをコピーしました');
    } catch (e) {
      console.error('コピー失敗', e);
    }
  };

  const importFromJson = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(uri);
        const imported = JSON.parse(content);
        if (Array.isArray(imported)) {
          setRecords(imported);
          Alert.alert('インポート成功', `記録を ${imported.length} 件読み込みました`);
        } else {
          Alert.alert('エラー', '無効なJSONフォーマットです');
        }
      }
    } catch (e) {
      console.error('インポート失敗', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={[sharedStyles.container, isDark && sharedStyles.darkBackground]}>
      <Text style={[sharedStyles.title, isDark && sharedStyles.darkText]}>データエクスポート・インポート</Text>
      <Button title="JSONとして共有する" onPress={exportToJson} />
      <View style={sharedStyles.spacer} />
      <Button title="CSVとして共有する" onPress={exportToCsv} />
      <View style={sharedStyles.spacer} />
      <Button title="JSONをクリップボードにコピー" onPress={copyToClipboard} />
      <View style={sharedStyles.largeSpacer} />
      <Button title="JSONからインポートする" onPress={importFromJson} />
    </ScrollView>
  );
}
