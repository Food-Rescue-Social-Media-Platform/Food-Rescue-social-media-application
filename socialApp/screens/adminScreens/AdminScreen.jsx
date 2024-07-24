import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Platform } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deletePost } from '../../FirebaseFunctions/collections/post'; // Adjust the path to your hook file
import FormButton from '../../components/formButtonsAndInput/FormButton';
import { database } from '../../firebase';
import { useTranslation } from 'react-i18next';

const AdminScreen = () => {
  const { logout } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const { t } = useTranslation();

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

  const handleDelete = async (reportId, postId, postUserId) => {
    try {
      // Delete the post
      await deletePost(postId, postUserId);
      
      // Delete the report
      await deleteDoc(doc(database, 'reports', reportId));

      // Update the local state to reflect the deletion
      setReports(reports.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    Platform.OS === 'web' ? (
      <View style={styles.container}>
        <Text style={styles.adminMessage}>{t('Reports Table')}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('Reporter ID')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('User Id')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('User Name')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('User Phone')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('Post Id')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('Post Img')}</Text>
            <Text style={[styles.columnHeader, styles.fixedWidth, styles.headerText]}>{t('Actions')}</Text>
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
                <Button
                  title={t("Delete")}
                  onPress={() => handleDelete(report.id, report.postId, report.postUserId)}
                  color="red"
                />
              </View>
            </View>
          ))}
        </View>
        <FormButton buttonTitle={t('Logout')} onPress={() => logout()} />
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.adminAlert}>{t('Dear Admin, You should login from the website to view the report posts page')}</Text>
        <FormButton buttonTitle={t('Logout')} onPress={() => logout()} />
      </View>
    )
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
    paddingHorizontal: 10,
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
    marginLeft: 5,
  },
  fixedWidth: {
    width: 200, // Adjust this value based on your layout
  },
  headerText: {
    marginLeft: 5,
  },
  adminAlert: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 10,
    color:'red',
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
  },
});
