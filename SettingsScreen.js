import React from 'react';
import { View, Text, Switch, useColorScheme } from 'react-native';
import { sharedStyles } from './theme';

export default function SettingsScreen({ includeDrawsInStats, setIncludeDrawsInStats }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={[sharedStyles.container, isDark && sharedStyles.darkBackground]}>
      <Text style={[sharedStyles.title, isDark && sharedStyles.darkText]}>設定</Text>

      <View style={{ marginVertical: 16 }}>
        <Text style={[sharedStyles.record, isDark && sharedStyles.darkText]}>引き分けを集計に含める</Text>
        <Switch
          value={includeDrawsInStats}
          onValueChange={setIncludeDrawsInStats}
        />
      </View>
    </View>
  );
}
