import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, Touchable } from 'react-native'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'

const estadoInicial = {
    desc: '',
    date: new Date(),
    showDatePicker: false
}

export default props => {

    const [estado, setEstado] = useState({ ...estadoInicial })

    const save = () => {
        const newTask = {
            desc: estado.desc,
            date: estado.date
        }

        props.onSave && props.onSave(newTask)

        // if(props.onSave != null) {
        //     props.onSave(newTask)
        // }

        setEstado({ ...estadoInicial })
    }

    const getDatePicker = () => {

        let datePicker = <DateTimePicker
            value={estado.date}
            onChange={(_, date) => setEstado(prev => {
                return {
                    ...prev, date: date, showDatePicker: false
                }
            })}
            mode='date'
        />

        const dateString = moment(estado.date).format('ddd, D [de] MMMM [de] YYYY')

        return (
            <View>
                <TouchableOpacity onPress={() => setEstado(prev => {
                    return {
                        ...prev,
                        showDatePicker: true
                    }
                })}>
                    <Text style={styles.date}>
                        {dateString}
                    </Text>
                </TouchableOpacity>
                {estado.showDatePicker && datePicker}
            </View>
        )

        return datePicker
    }

    return (
        <Modal transparent={true} visible={props.isVisible}
            onRequestClose={props.onCancel}
            animationType='slide'>
            <TouchableWithoutFeedback
                onPress={props.onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <Text style={styles.header}>Nova Tarefa</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Informe a Descrição'
                    onChangeText={desc => setEstado(prev => {
                        return { ...prev, desc }
                    })}
                    value={estado.desc}
                />
                {getDatePicker()}

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={props.onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={save}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <TouchableWithoutFeedback
                onPress={props.onCancel}>
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        flex: 2,
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#b13b44',
        color: '#fff',
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {
        height: 40,
        margin: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 8
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 28,
        color: '#b13b44'
    },
    date: {
        fontSize: 20,
        marginLeft: 16
    }
})