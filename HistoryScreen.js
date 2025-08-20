import React from 'react';
import { View, Text, FlatList, Button, useColorScheme } from 'react-native';
import { sharedStyles } from './theme';

export default function HistoryScreen({ records, deleteRecord }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[sharedStyles.container, isDark && sharedStyles.darkBackground]}>
      <Text style={[sharedStyles.title, isDark && sharedStyles.darkText]}>対戦履歴</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={sharedStyles.record}>
              [{item.date}] {item.stage} / {item.role} / {item.character} / {item.result} / {item.playType} / {item.matchType}
            </Text>
            <Button title="削除" onPress={() => deleteRecord(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
