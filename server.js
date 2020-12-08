const express=require('express')
const app=express()
const server =require('http').createServer(app)

const uuid=require('uuid')

const io=require('socket.io')(server)

const {ExpressPeerServer}=require('peer')
const peerServer=ExpressPeerServer(server,{
    debug:true
})



const port=process.env.PORT || 80

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use('/peerjs', peerServer);



io.on('connection',(socket)=>{
    console.log(`Web socket connected`)


    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)

        socket.on('message',(msg)=>{
            io.to(roomId).emit('createMessage',msg)
        })
        
    })
})
app.get('/',(req,res)=>{
    res.redirect(`/${uuid.v4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})

server.listen(port,()=>{
    console.log(`Server is up and running at ${port}`)
})