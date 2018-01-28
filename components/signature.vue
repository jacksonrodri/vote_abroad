<template>
  <div class="hello">
    <video v-bind:width="width" v-bind:height="height" :autoplay="autoplay" :playsinline="playsinline" :controls="controls" ref="video"></video>
    <hr/>
    <img v-bind:src="optimizedPhoto" alt="" v-bind:width="width" v-bind:height="height"/>
    <hr/>
    <img v-bind:src="photo" v-show="false" alt="" v-bind:width="width" v-bind:height="height" ref="pic"/>
    <hr/>
    <button type="button" v-on:click="takePhoto">Take Photo</button>
    <hr/>
    <input id="brightnessSlider" class="slider has-output is-fullwidth" min="0" max="100" v-model="brightness" step="1" type="range" @change="updatePhoto($event)">
    <output for="brightnessSlider">{{ brightness }}</output>
    <input id="contrastSlider" class="slider has-output is-fullwidth" min="0" max="100" v-model="contrast" step="1" type="range" @change="updatePhoto($event)">
    <output for="contrastSlider">{{ contrast }}</output>
  </div>
</template>

<script>
import fx from '~/assets/vendor/glfx'
import slider from '~/components/slider'

export default {
  components: {
    slider
  },
  data () {
    return {
      src: '',
      width: '400',
      height: '300',
      autoplay: true,
      playsinline: true,
      controls: true,
      photo: '',
      optimizedPhoto: '',
      screenshotFormat: 'image/png',
      brightness: '20',
      contrast: '70',
      _refs: null,
      _video: null,
      _stream: null,
      _hasUserMedia: false,
      _ctx: null,
      msg: 'Welcome to your Vue App'
    }
  },
  methods: {
    updatePhoto (evt) {
      console.log(this._pic)
      var canvas = this.getFilteredCanvas(this.brightness, this.contrast)
      this.optimizedPhoto = canvas.toDataURL(this.screenshotFormat)
    },
    takePhoto () {
      if (!this._hasUserMedia) {
        return
      }
      // var canvas = this.getCanvas()
      this.getCanvas()
      // this.photo = canvas.toDataURL(this.screenshotFormat)
    },
    getCanvas () {
      if (!this._hasUserMedia) {
        return null
      }

      if (this._ctx == null) {
        var canvas = fx.canvas()
        canvas.height = this._video.clientHeight
        canvas.width = this._video.clientWidth
        var texture = canvas.texture(this._video)
        canvas.draw(texture)
          // .hueSaturation(-1, -1) // grayscale
          // .unsharpMask(20, 2)
          // .brightnessContrast(brightness ? brightness / 100 : 0.2, saturation ? saturation / 100 : 0.7)
          .update()
        this.photo = canvas.toDataURL(this.screenshotFormat)
        var canvas2 = fx.canvas()
        canvas2.height = this._video.clientHeight
        canvas2.width = this._video.clientWidth
        var texture2 = canvas2.texture(this._video)
        canvas2.draw(texture2)
          .hueSaturation(-1, -1) // grayscale
          .unsharpMask(20, 2)
          .brightnessContrast(0.2, 0.7)
          .update()
        this.optimizedPhoto = canvas2.toDataURL(this.screenshotFormat)

        return

        // return canvas
      }
      return null
    },
    getMediaDevices () {
      var md = navigator.mediaDevices
      if (md != null) {
        return md
      }
    },
    getFilteredCanvas (saturation, brightness) {
      if (!this._hasUserMedia) {
        return null
      }

      if (this._ctx == null) {
        var canvas = fx.canvas()
        canvas.height = this._pic.clientHeight
        canvas.width = this._pic.clientWidth
        var texture = canvas.texture(this._pic)
        canvas.draw(texture)
          .hueSaturation(-1, -1) // grayscale
          .unsharpMask(20, 2)
          .brightnessContrast(brightness ? brightness / 100 : 0.2, saturation ? saturation / 100 : 0.7)
          .update()

        return canvas
      }

      return null
    }
  },
  mounted () {
    this._refs = this.$refs
    this._video = this._refs.video
    this._pic = this._refs.pic
    console.log('pic: ', this._pic.src, 'video: ', this._video)

    var md = this.getMediaDevices()
    md.getUserMedia({
      audio: false,
      video: {
        frameRate: 10,
        facingMode: 'environment'
      }
    })
      .then((stream) => {
        // this.src = window.URL.createObjectURL(stream)
        this.src = stream
        this._video.srcObject = stream
        this._stream = stream
        this._hasUserMedia = true
      }, (err) => {
        console.log(err)
      })
      // .then((stream) => {
      //   // console.log(stream)
      //   this.optimizedPhoto = this._stream.captureStream(25)
      // })
  },
  beforeDestroy () {
    this._video.pause()
    this.src = null
    this._stream.getTracks()[0].stop()
  },
  destroyed () {
    console.log('Destroyed')
  }
}
</script>
