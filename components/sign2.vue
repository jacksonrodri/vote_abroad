<template>
  <div class="card">
    <div class="card-content">
      <p class="title is-5">Signature Capture</p>
      <ol class="is-size-6">
        <li>Sign your name on white paper with a dark pen.  </li>
        <li>Hold it in front of your camera and align it in the box.</li>
        <li>Click capture and adjust it.</li>
        {{ details }}
      </ol>
      <div class="signature">
        <div class="signatureline"></div>
        <div>
          <video v-show="isCapture"
            @play.native="timerCallback()"
            v-bind:width="width"
            v-bind:height="height"
            :autoplay="autoplay"
            :playsinline="playsinline"
            :controls="controls"
            ref="video"
            style="width: 1px; height: 1px; margin -1px; filter: grayscale(100%) brightness(200%) contrast(100%)"></video>
          <canvas ref="sigCanvas"
            v-bind:width="width / 3"
            v-bind:height="height / 3"
            v-show="false"></canvas>
          <canvas ref="edited"
            v-bind:width="width / 3"
            v-bind:height="height / 3"
            v-on:click="takePhoto"
            style="background-image:url('/fpca_sign.png'); background-size: cover;"></canvas>
        </div>
      </div>
      <b-collapse class="card is-shadowless" :open.sync="isEditing">
        <div class="card-header" slot="trigger">
          <p class="card-header-title">Adjust photo</p>
          <a class="card-header-icon">
            <b-icon :icon="isEditing ? 'menu-down' : 'menu-up'"></b-icon>
          </a>
        </div>
        <div class="card-content">
          <div class="content">
            <h2 class="subtitle is-6">Brightness (increase until background is white)</h2>
            <input id="brightnessSlider" class="slider has-output is-fullwidth" min="0" max="300" v-model="brightness" step="1" @input="computeFrame" type="range">
            <!-- <output for="brightnessSlider">{{ brightness }}</output> -->
            <h2 class="subtitle is-6">Contrast (decrease until signature is clearly visible)</h2>
            <input id="contrastSlider" class="slider has-output is-fullwidth" min="0" max="300" v-model="contrast" step="1" @input="computeFrame" type="range">
            <!-- <output for="contrastSlider">{{ contrast }}</output> -->
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
        <a class="is-primary" v-on:click="save">Save</a>
      </p>
    </footer>
  </div>
</template>

<script>
import slider from '~/components/slider'

export default {
  components: {
    slider
  },
  data () {
    return {
      src: '',
      width: 1280,
      height: 720,
      autoplay: false,
      playsinline: true,
      controls: false,
      photo: '',
      optimizedPhoto: '',
      screenshotFormat: 'image/png',
      brightness: 100,
      contrast: 100,
      _refs: null,
      _video: null,
      _stream: null,
      _hasUserMedia: false,
      _ctx: null,
      ctx1: null,
      isCapture: true,
      isEditing: false,
      details: 'nothing yet',
      paused: true
    }
  },
  computed: {
    cont () { return Math.exp(parseInt(this.contrast) / 100) },
    br () { return parseInt(this.brightness) }
  },
  watch: {
    paused (newVal, oldVal) {
      if (newVal === false) {
        this.timerCallback()
      }
    }
  },
  methods: {
    save () {
      this.optimizedPhoto = this.$refs.edited.toDataURL()
      this.$emit('sigcap', this.optimizedPhoto)
      this.$parent.close()
    },
    reset () {
      this.isCapture = true
      this.$refs.video.play()
      this.paused = false
    },
    takePhoto () {
      if (!this._hasUserMedia) {
        return
      }
      this.$refs.video.pause()
      this.paused = true
      this.isCapture = false
    },
    getMediaDevices () {
      var md = navigator.mediaDevices
      if (md != null) {
        return md
      }
    },
    timerCallback () {
      if (!this.$refs.video.paused) {
        window.requestAnimationFrame(() => {
          if (this.$refs.video.paused) { return }
          this.computeFrame()
          this.timerCallback()
        })
      } else {
        // console.log('video ended')
      }
    },
    computeFrame () {
      let videoWidth = this.width
      let videoHeight = this.height
      let sourceX = 240
      let sourceY = 480
      let sourceW = videoWidth / 3
      let sourceH = videoHeight / 3
      let destX = 0
      let destY = 0
      let destW = videoWidth / 3
      let destH = videoHeight / 3
      if (this.isCapture) { this.ctx1.drawImage(this.$refs.video, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH) }
      let frame = this.ctx1.getImageData(0, 0, destW, destH)
      let l = frame.data.length / 4

      for (let i = 0; i < l; i++) {
        // let r = frame.data[i * 4 + 0]
        // let g = frame.data[i * 4 + 1]
        // let b = frame.data[i * 4 + 2]
        let avg = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3
        avg = Math.floor(this.cont * (avg - 128) + 128 + this.br)
        frame.data[i * 4 + 0] = avg
        frame.data[i * 4 + 1] = avg
        frame.data[i * 4 + 2] = avg
        frame.data[i * 4 + 3] = 256 - avg
      }
      this.ctx2.putImageData(frame, 0, 0)
    }
  },
  mounted () {
    this._refs = this.$refs
    this._video = this._refs.video
    this.ctx1 = this._refs.sigCanvas.getContext('2d')
    this.ctx2 = this._refs.edited.getContext('2d')
    // console.log('video: ', this._video)

    var md = this.getMediaDevices()
    md.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
        width: 1280,
        height: 720,
        aspectRatio: 1.7777777778
      }
    })
      .then((stream) => {
        this.src = stream
        this._video.srcObject = stream
        this._stream = stream
        this._hasUserMedia = true
        // console.log(this.paused)
        this._video.addEventListener('canplay', () => {
          // console.log('canplay', this._video)
          // this.width = this._video.videoWidth
          // this.height = this._video.videoHeight
          this.width = 1280
          this.height = 720
          // this.timerCallback()
          this.paused = false
          this._video.play()
        })
      }, (err) => {
        console.error(err)
      })
  },
  beforeDestroy () {
    this.$refs.video.pause()
    this.src = null
    this._stream.getTracks()[0].stop()
  },
  destroyed () {
    // console.log('Destroyed')
  }
}
</script>

<style>
canvas {
  max-width: 100%;
}
</style>
