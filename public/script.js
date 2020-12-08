
const socket = io('/');


const videogrid=document.getElementById('video-grid');

const myvideoelement=document.createElement('video')
myvideoelement.muted=true



var peer=new Peer(undefined,{
   path:'/peerjs',
   host: '/',
   port: 80 
})
let myvideostream


peer.on('open',(id)=>{
    socket.emit('join-room',ROOM_ID,id);
})

navigator.mediaDevices.getUserMedia({
    audio: true, 
    video: true
})
.then((stream)=> {
  myvideostream=stream
  addVideoStream(myvideoelement,stream)

  peer.on('call', call=> {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', uservideostream=> {
            const uservideoelement=document.createElement('video')
            addVideoStream(uservideoelement,uservideostream)
       })
  })
  socket.on('user-connected',(userId)=>{
    connectToNewUser(userId,stream)
  })
    let text= $('input')
    $('html').keydown((e)=>{
        
        if(e.which==13 && text.val()!=null){
            console.log(text.val())
            socket.emit('message',text.val())
            text.val('')
        }
    })

    socket.on('createMessage',(message)=>{
        $('ul').append(`<li class="message"><br>user <br> ${message} <br></li>
        `)
        scrollToBottom()
    })
})


.catch((err)=> {
  console.log(err)
});


const connectToNewUser=(userId,stream)=>{
    const  call = peer.call(userId,stream)

    const uservideoelement=document.createElement('video')
    

    call.on('stream', uservideostream=> {
        addVideoStream(uservideoelement,uservideostream)        
    })
}



const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video)
}

const scrollToBottom=()=>{
    let d= $('.main__chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}


const muteUnmute=()=>{
    const enabled=myvideostream.getAudioTracks()[0].enabled
    if(enabled){ //is case me mute krna h 
        myvideostream.getAudioTracks()[0].enabled=false
        setUnmuteButton()
    }
    else{//is case me unmute krna h
        setMuteButton()
        myvideostream.getAudioTracks()[0].enabled=true

    }
}

 const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}


const playStop = () => {
    console.log('object')
    let enabled = myvideostream.getVideoTracks()[0].enabled;
    if (enabled) {
        myvideostream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myvideostream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}








