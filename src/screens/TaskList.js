import { useState, useEffect } from 'react'
import {
    View, Text, StyleSheet, ImageBackground,
    TouchableOpacity, FlatList
}
    from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment-timezone'
import 'moment/locale/pt-br'

import Task from '../components/Task';
import AddTask from '../components/AddTask'
import todayImage from '../../assets/img/today.jpg'

import axios from 'axios'
import { API_CONFIG } from '../config/api'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const taskDB = []

export default function TaskList() {

    const today =
        moment()
            .tz('America/Sao_Paulo')
            .locale('pt-br')
            .format('ddd, D [de] MMMM')

    const [tasks, setTasks] = useState([...taskDB])
    const [showAddTask, setShowAddTask] = useState(false)

    useEffect(() => {
        getTasks()
    }, [])



    async function getTasks() {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/tasks`)
            setTasks(response.data)
        } catch (error) {
            console.error('Erro ao carregar os dados', error)
        }
    }

    const toggleTask = async (taskId) => {

        const taskList = [...tasks]

        let taskUpdate = null

        taskList.forEach(task => {
            if (task.id === taskId) {
                task.doneAt = task.doneAt ? null : new Date()
                taskUpdate = task
            }
        })

        try {
            const response = await axios.put(`${API_CONFIG.BASE_URL}/tasks/${taskUpdate.id}`, taskUpdate)
        } catch (error) {
            console.error('Erro ao atualizar o registro', error)
        }
        getTasks()
    }

    const addTask = async newTask => {
        const tempTasks = [...tasks]

        const taskAdd = {
            desc: newTask.desc,
            estimatedAt: newTask.date,
            doneAt: null
        }

        try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/tasks`, taskAdd)
        } catch (error) {
            console.error('Erro ao inserir o dado', error)
        }
        getTasks()
        setShowAddTask(false)
    }
    const deleteTask = async id => {
        try {
            const response = await axios.delete(`${API_CONFIG.BASE_URL}/tasks/${id}`)
        } catch (error) {
            console.error('Erro ao atualizar o registro', error)
        }
        getTasks()
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>

                <AddTask
                    isVisible={showAddTask}
                    onCancel={() => setShowAddTask(false)}
                    onSave={addTask}
                />

                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity>
                            <FontAwesome name="eye" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>

                <View style={styles.taskList}>
                    <FlatList
                        data={tasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) =>
                            <Task {...item} onToggleTask={toggleTask} onDelete={deleteTask} />}
                    />
                </View>

                <TouchableOpacity style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => setShowAddTask(true)}>
                    <FontAwesome name='plus' size={20} color={'white'} />
                </TouchableOpacity>

            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 3 },
    taskList: { flex: 7 },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: 24
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        color: 'white',
        fontSize: 48,
        marginLeft: 24,
        marginBottom: 24
    },
    subtitle: {
        color: 'white',
        fontSize: 24,
        marginLeft: 24,
        marginBottom: 36
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#b13b44',
        justifyContent: 'center',
        alignItems: 'center'
    }
})