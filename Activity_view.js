import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

const Activity_view = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the endpoint
    fetch('http://192.168.1.114:8082/adnya/club/get_main_activity')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 50 }]}>ID</Text>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 150 }]}>Name</Text>
            <Text style={[styles.tableCell, styles.headerCell, { minWidth: 250 }]}>Description</Text>
          </View>

          {/* Table Data */}
          {activities.length > 0 ? (
            activities.map((item) => (
              <View
                style={[
                  styles.tableRow,
                  item.id % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
                key={item.id}
              >
                <Text style={[styles.tableCell, { maxWidth: 20 }]}>{item.id}</Text>
                <Text style={[styles.tableCell, { maxWidth: 80 }]}>{item.name}</Text>
                <Text style={[styles.tableCell, { maxWidth: 140 }]}>{item.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No activities found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light background for the page
  },
  table: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff', // White background for the table
    elevation: 3, // Adds shadow for better appearance
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF', // Primary blue for header
  },
  evenRow: {
    backgroundColor: '#f8f9fa', // Light grey for even rows
  },
  oddRow: {
    backgroundColor: '#ffffff', // White for odd rows
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#212529',
    textAlign: 'left',
    flexWrap: 'wrap', // Ensures text wrapping
    minWidth: 100, // Ensures consistent cell width
  },
  headerCell: {
    color: '#ffffff', // White text for header
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    margin: 20,
  },
});

export default Activity_view;
