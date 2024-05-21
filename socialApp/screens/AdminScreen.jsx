import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Platform, TextInput } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { database } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import FormButton from '../components/formButtonsAndInput/FormButton';

const AdminScreen = () => {
  const { logout } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, 'reports'));
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.adminMessage}>Reports Table</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>Reporter ID</Text>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>User Id</Text>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>User Name</Text>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>User Phone</Text>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>Post Id</Text>
          <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>Post Img</Text>
        </View>
        
        {reports.map(report => (
          <View key={report.id} style={styles.tableRow}>
            <View style={styles.row}>
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.reporterId}
                editable={false}
              />
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.postUserId}
                editable={false}
              />
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.post.userName}
                editable={false}
              />
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.post.phoneNumber}
                editable={false}
              />
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.postId}
                editable={false}
              />
              <TextInput
                style={[styles.cell, styles.fixedWidth]}
                value={report.post.postImg}
                editable={false}
              />
            </View>
          </View>
        ))}
      </View>
      <FormButton buttonTitle='Logout' onPress={() => logout()} />
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  columnHeader: {
    fontWeight: 'bold',
    paddingVertical: 20,

  },
  cell: {
    paddingVertical: 20,
    marginLeft:5,
  },
  fixedWidth: {
    width: 235, // Adjust this value based on your layout
  },
  headerText:{
    marginLeft:5,
  },
});
