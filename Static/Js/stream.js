
const APP_ID = '0b9af9d17d3c48aa928633bc76883f52'
const CHANNEL =  sessionStorage.getItem('room')
const TOKEN =  sessionStorage.getItem('token')
let Uid = Number(sessionStorage.getItem('UID'))
let NAME = sessionStorage.getItem('username')

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})


let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalScreen = async () => {
    document.getElementById('room-name').innerText = CHANNEL
    client.on('user-published', handleUserJoined )
    client.on('user-left', handleUserLeft )

    try{
        await client.join(APP_ID, CHANNEL, TOKEN, Uid)
    }catch (error){
        console.error(error)
        window.open('/', '_self')
    }


    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${Uid}">
                        <div class="username-wrapper"><span class="user-name">${NAME}</span></div>
                        <div class="video-player" id="user-${Uid}">
        
                        </div>
                    </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${Uid}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }
         player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="username-wrapper"><span class="user-name">${NAME}</span></div>
                        <div class="video-player" id="user-${user.uid}">
        
                        </div>
                    </div>`
         document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }

}
let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
    alert(`user-${user.uid} leave the stream`);


}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i ; i++){
        localTracks[i].stop()
        localTracks[i].close()

    }
    await client.leave()
    window.open('/', '_self')
}

let toogleCammera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)'
    }
}

let toogleMicrophone = async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgba(255, 80, 80, 1)'
    }
}

joinAndDisplayLocalScreen()

document.getElementById('mic-btn').addEventListener('click', toogleMicrophone)
document.getElementById('camera-btn').addEventListener('click', toogleCammera)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)



