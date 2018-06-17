<template>
  <video :autoplay="autoplay"
              :playsinline="playsinline"
              ref="video"></video>
              <!-- :controls="controls" -->
              <!-- @play="timerCallback()" -->
</template>

<script>
require('webrtc-adapter')
export default {
  data () {
    return {
      autoplay: 'autoplay',
      playsinline: 'playsinline'
      // controls: false
    }
  },
  mounted () {
    console.log(this.$el)
    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log('devices', devices)
      devices = devices.filter(v => (v.kind === 'videoinput'))
      console.log('Found ' + devices.length + ' video devices')
      let lastDevice = devices[devices.length - 1]
      devices = devices.filter(v => (v.label.indexOf('back') > 0))
      let device = null
      if (devices.length > 0) {
        console.log("Taking a 'back' camera")
        device = devices[devices.length - 1]
      } else {
        console.log('Taking last camera')
        device = lastDevice
      }

      if (!device) {
        console.log('No devices!')
        return
      }

      let constraints =
      {
        audio: false,
        video: true
        // {
        //   deviceId: { ideal: device.deviceId }
        //   // facingMode: 'environment',
        //   // width: { ideal: 1280 },
        //   // height: { ideal: 720 }
        // }
        // video: true
        // video: {
        //   deviceId: { ideal: device.deviceId },
        //   width: { ideal: window.innerWidth },
        //   height: { ideal: window.innerHeight }
        // }
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          if (this.$el.srcObject) { this.$el.srcObject = stream } else { this.$el.src = URL.createObjectURL(stream) }
          // info.innerHTML+= "<pre>DONE</pre>";
          console.log('DONE')
        })
        .catch(err => {
          console.log(err.name + ': ' + err.message)
        })
    })
      .catch(err => {
        console.error(err)
        console.log(err.name + ': ' + err.message)
      })
  }
}
</script>

<style>

</style>
