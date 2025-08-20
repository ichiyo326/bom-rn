// これは UI/UX 微調整のためのスタイルパッチです

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  formGroup: {
    marginBottom: 24
  },
  picker: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12
  },
  record: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#444'
  },
  item: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2
  }
});
