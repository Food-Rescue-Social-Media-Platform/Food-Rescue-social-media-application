import React, {useEffect, useState} from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ModalAddPost = ({ show }) => {
    const [ showModal, setShowModal ] =  useState(false);

    useEffect(() => {
        setShowModal(show);
        console.log('Show modal: ', show);
    },[show]);

    const handlePost = () => {
        console.log('Post');
    }

    const handleClose = () => {
        setShowModal(false);
    }
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                    >
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Add Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What's on your mind?"
                        multiline
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


const styles = {
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
};


export default ModalAddPost;