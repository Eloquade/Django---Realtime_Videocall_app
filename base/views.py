from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time


# Create your views here.

def Lobby(request):
    return render(request, 'base/lobby.html')


def Room(request):
    return render(request, 'base/room.html')


def getToken(request):
    appId = '0b9af9d17d3c48aa928633bc76883f52'
    appCertificate = '63a4d5122616472ea094c76178d61f31'
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeinSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeinSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token, 'uid': uid}, safe=False)



