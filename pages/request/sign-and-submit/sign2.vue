<template>
  <div class="section">
    <div class="box" style="position:relative;height:500px" ref="parent">
      <video id="video" ref="video" width="620" height="480" preload autoplay muted style="position:absolute;"></video>
      <canvas id="canvas" ref="canvas" width="620" height="480" style="position:absolute;"></canvas>
    </div>
  </div>
</template>

<script>
// import tracking from 'tracking'
// require('webrtc-adapter/out/adapter.js')

export default {
  head () {
    return {
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/6.1.1/adapter.min.js' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js' }
      ]
    }
  },
  data () {
    return {
      _parent: null
    }
  },
  mounted () {
    let video = this.$refs.video
    let canvas = this.$refs.canvas
    let ctx = canvas.getContext('2d')
    if (process.browser) {
      window.onNuxtReady(function (app) {
        let tracking = window.tracking
        var tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow'])
        tracking.track('#video', tracker, {camera: true})

        tracker.on('track', function (event) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(video, 0, 0)
          var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          var gray = tracking.Image.grayscale(imageData.data, canvas.width, canvas.height, true)
          ctx.putImageData(new ImageData(gray, canvas.width, canvas.height), 0, 0)
          // console.log(grey)
          event.data.forEach(function (rect) {
            ctx.strokeStyle = rect.color
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
            ctx.font = '11px Helvetica'
            ctx.fillStyle = '#fff'
            ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
            ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
          })
        })
        // var canvasParent = this.$refs.parent
        // function draw (x, y, w, h, color) {
        //   ctx.strokeStyle = color
        //   ctx.strokeRect(x, y, w, h)
        //   ctx.fillStyle = '#fff'
        //   ctx.fillText('x: ' + x + 'px', x + w + 5, y + 11)
        // }
      })
    }
  }

}
</script>

<style>

</style>
