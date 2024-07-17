"use client"
import { JitsiMeeting } from '@jitsi/react-sdk';
import React from 'react'
import { useSelector } from 'react-redux';



interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}


const configOverwrite = {
    startWithAudioMuted: true,
    disableModeratorIndicator: true,
    startScreenSharing: true,
    enableEmailInStats: false,
    toolbarButtons: [
        'camera',
        'chat',
        'closedcaptions',
        'desktop',
        'download',
        'embedmeeting',
        'etherpad',
        'feedback',
        'filmstrip',
        'fullscreen',
        'hangup',
        'help',
        'highlight',
        'linktosalesforce',
        'livestreaming',
        'microphone',
        'noisesuppression',
        'participants-pane',
        'profile',
        'raisehand',
        'recording',
        'security',
        'select-background',
        'settings',
        'shareaudio',
        'sharedvideo',
        'shortcuts',
        'stats',
        'tileview',
        'toggle-camera',
        'videoquality',
        'whiteboard',
    ],
}

function Meeting({ roomId }: { roomId: string }) {
    const { name, verified, tenantId } = useSelector((state: RootState) => state.user)

    return (
        <div className='flex justify-center mt-10'>
            <JitsiMeeting
                domain='meet.jit.si'
                roomName={roomId}
                configOverwrite={configOverwrite}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                    displayName: name,

                }}
                onApiReady={(externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '90vh'; iframeRef.style.width = '90vw'; }}
            />
        </div>
    )
}

export default Meeting