import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';

export default AdminScreen = ({ navigation }) => {
  const adminOptions = [
    { id: 0, title: 'Main Activities', source: require('./assets/messages_inactive.png'), path: 'MainActivityScreen' },
    { id: 1, title: 'Sub Activities', source: require('./assets/messages_inactive.png'), path: 'SubActivityScreen' },
    { id: 2, title: 'Events', source: require('./assets/messages_inactive.png'), path: '' },
    { id: 3, title: 'Members', source: require('./assets/messages_inactive.png'), path: '' },
    { id: 4, title: 'Reports', source: require('./assets/messages_inactive.png'), path: '' },
    { id: 5, title: 'Settings', source: require('./assets/messages_inactive.png'), path: '' },
    { id: 6, title: 'Back', source: require('./assets/messages_inactive.png'), path: 'Menu' },
  ];

  const clickEventListener = (item) => {
    navigation.navigate(item.path);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={adminOptions}
        horizontal={false}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <TouchableOpacity style={styles.card} onPress={() => clickEventListener(item)}>
                <Image style={styles.cardImage} source={item.source} />
              </TouchableOpacity>
              <View style={styles.cardHeader}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#84bdfa',
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#84bdfa',
  },
  listContainer: {
    alignItems: 'center',
  },
  card: {
    shadowColor: '#474747',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 18,
    marginVertical: 18,
    marginHorizontal: 35,
    backgroundColor: '#000000', // Change color if needed
    width: 80,
    height: 80,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    height: 110,
    width: 110,
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#ffffff', // Adjust the color for better readability
    textAlign: 'center',
  },
});
