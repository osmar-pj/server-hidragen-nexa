import mqtt from 'mqtt'

const socketIO = require('socket.io')

const socket = {}
let io

function connect(server) {
    io = socketIO(server)
    socket.io = io
    let USERS = {}
    io.on('connection', socket => {
        console.log(`${socket.id} se conecto`)
        USERS[socket.id] = socket
        socket.on('disconnect', () => {
            console.log(`${socket.id} se desconecto`)
        })
    })

    const options = {
        clientId: process.env.MQTT_CLIENT_SRV,
        username: 'digitalOceanServer',
        password: ''
      }
      
    const connectUrl = process.env.URL_MQTT
    const client = mqtt.connect(connectUrl, options)
    client.on('connect', () => {
    // console.log('Client connected by SERVER:')
    // Subscribe
    client.subscribe(process.env.TOPIC_MQTT_SENSOR, { qos: 0 })
    })
    
    let sensors = []
    let datasFiltered = []
      
    client.on('message', async (topic, message) => {
        const data = JSON.parse(message.toString())
        data.createdAt = new Date()
        sensors.push(data)
        if (sensors.length > 10) {
            // reverse sensors
            // borrar ultimo dato
            sensors.shift()
        }
        if (sensors) {
            datasFiltered = sensors.reverse().filter((elem, index, self) => {
                return self.map(item => item.nm.toString()).indexOf(elem.nm.toString()) === index
            })
        }
    })

    setInterval(async () => {
        // for (let i in USERS) {
        //     USERS[i].emit('ratio', {
        //         ratioData
        //     })
        // }
    }, 10000)
}

module.exports = {
    connect,
    socket
}

// PARA LLAMAR AL SOCKET DESDE DONDE SEA DEL BACKEND

/*
    const socket = require($route of socket.js$).socket
    const {socket} = require($route of socket.js$)
    socket.io.emit('data', data)
*/
