<template>
  <div class="card">
    <div class="card-content">
      <p class="title">Signature Capture</p>
      <video v-show="isCapture" v-bind:width="width" v-bind:height="height" :autoplay="autoplay" :playsinline="playsinline" :controls="controls" ref="video"></video>
      <img v-show="!isCapture" v-bind:src="optimizedPhoto" alt="" v-bind:width="width" v-bind:height="height"/>
      <img v-bind:src="photo" v-show="false" alt="" v-bind:width="width" v-bind:height="height" ref="pic"/>
      <b-collapse v-show="!isCapture" class="card is-shadowless" :open.sync="isEditing">
        <div class="card-header" slot="trigger">
          <p class="card-header-title">Adjust photo</p>
          <a class="card-header-icon">
            <b-icon :icon="isEditing ? 'menu-down' : 'menu-up'"></b-icon>
          </a>
        </div>
        <div class="card-content">
          <div class="content">
            <h2 class="subtitle is-6">Brightness (increase until background is white)</h2>
            <input id="brightnessSlider" class="slider has-output is-fullwidth" min="0" max="100" v-model="brightness" step="1" type="range" @change="updatePhoto($event)">
            <output for="brightnessSlider">{{ brightness }}</output>
            <h2 class="subtitle is-6">Contrast (decrease until signature is clearly visible)</h2>
            <input id="contrastSlider" class="slider has-output is-fullwidth" min="0" max="100" v-model="contrast" step="1" type="range" @change="updatePhoto($event)">
            <output for="contrastSlider">{{ contrast }}</output>
          </div>
        </div>
      </b-collapse>
    </div>
    <footer class="card-footer">
      <p class="card-footer-item">
        <a v-if="!isCapture" class="is-primary" v-on:click="reset">Take Another</a>
        <a v-if="isCapture" class="is-primary" v-on:click="takePhoto">Take Photo</a>
      </p>
      <p  v-if="!isCapture" class="card-footer-item">
        <a class="is-primary" v-on:click="reset">Save</a>
      </p>
    </footer>
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
      isCapture: true,
      isEditing: false
    }
  },
  methods: {
    updatePhoto (evt) {
      console.log(this._pic)
      var canvas = this.getFilteredCanvas(this.brightness, this.contrast)
      this.optimizedPhoto = canvas.toDataURL(this.screenshotFormat)
    },
    reset () {
      this.isCapture = true
    },
    takePhoto () {
      if (!this._hasUserMedia) {
        return
      }
      this.isCapture = false
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
          .brightnessContrast(this.brightness ? this.brightness / 100 : 0.2, this.saturation ? this.saturation / 100 : 0.7)
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
