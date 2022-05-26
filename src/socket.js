import axios from 'axios'

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

    setInterval(async () => {
        axios.get(`${process.env.URL_SERVER_FLASK}/api/v1/trips`)
        .then(res => {
            const trips = res.data.trips
            for (let i in USERS) {
                USERS[i].emit('trips', trips)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, 300000)

    setInterval(async () => {
        axios.get(`${process.env.URL_SERVER_FLASK}/api/v1/lastweek`)
        .then(res => {
            const lastweek = res.data.lastweek
            for (let i in USERS) {
                USERS[i].emit('lastweek', lastweek)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, 60000)
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
