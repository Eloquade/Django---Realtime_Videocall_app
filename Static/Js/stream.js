
const APP_ID = '0b9af9d17d3c48aa928633bc76883f52'
const CHANNEL = 'main'
const TOKEN = '0060b9af9d17d3c48aa928633bc76883f52IADVMYpoOf56vQBBpmzzPELs9ZPL92sZsKO84IOg6+Fm5WTNKL8AAAAAEADzS24fs/WqYgEAAQDs9api'
let Uid;
const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})


let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalScreen = async () => {
    Uid = await client.join(APP_ID, CHANNEL, TOKEN, )

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${Uid}">
                        <div class="username-wrapper"><span class="user-name">My Name</span></div>
                        <div class="video-player" id="user-${Uid}">
        
                        </div>
                    </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${Uid}`)

    await client.publish([localTracks[0], localTracks[1]])
}

joinAndDisplayLocalScreen()
