import React, { useState } from "react";
import { Modal, View, Text, Pressable, FlatList, StyleSheet, TouchableWithoutFeedback } from "react-native";

export default function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const modalKey = `${label}-${Array.isArray(options)? options.length : "0"}`;

  return (
    <>
      <Pressable style={styles.row} onPress={() => setOpen(true)}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
      </Pressable>

      <Modal key={modalKey} visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{label}</Text>
          <FlatList
            data={Array.isArray(options) ? options : []}
            extraData={options}                // ★ options 変化で再描画
            keyExtractor={(item, idx) => String(item ?? idx)}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.item, item === value && styles.itemActive]}
                onPress={() => { onChange(item); setOpen(false); }}
              >
                <Text style={[styles.itemText, item === value && styles.itemTextActive]}>{item}</Text>
              </Pressable>
            )}
          />
          <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
            <Text style={styles.closeText}>閉じる</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#ddd", paddingVertical:12, paddingHorizontal:14, marginBottom:10 },
  label:{ color:"#475467", marginBottom:4, fontSize:12 },
  value:{ fontSize:16, color:"#111" },
  backdrop:{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundColor:"#0008" },
  sheet:{ position:"absolute", left:16, right:16, top:80, bottom:80, backgroundColor:"#fff", borderRadius:16, padding:12 },
  sheetTitle:{ fontWeight:"700", fontSize:16, marginBottom:8 },
  item:{ paddingVertical:12, paddingHorizontal:10, borderRadius:8 },
  itemActive:{ backgroundColor:"#eef4ff" },
  itemText:{ fontSize:16, color:"#111" },
  itemTextActive:{ color:"#1d4ed8", fontWeight:"700" },
  closeBtn:{ marginTop:8, alignSelf:"flex-end", paddingVertical:8, paddingHorizontal:12 },
  closeText:{ color:"#1d4ed8", fontWeight:"700" },
});
