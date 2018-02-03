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
            v-bind:width="width / 3"
            v-bind:height="height / 3"
            :autoplay="autoplay"
            :playsinline="playsinline"
            :controls="controls"
            ref="video"
            style="filter: grayscale(100%) brightness(200%) contrast(100%)"></video>
          <canvas ref="sigCanvas" v-show="!isCapture" style="width:427px;"></canvas>
          <canvas ref="edited" v-show="isCapture" style="width:427px; background-image:url('fpca_sign.png')"></canvas>
        </div>
      </div>
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
import slider from '~/components/slider'

export default {
  components: {
    slider
  },
  data () {
    return {
      src: '',
      width: '1280',
      height: '720',
      autoplay: true,
      playsinline: true,
      controls: false,
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
      ctx1: null,
      isCapture: true,
      isEditing: false,
      details: 'nothing yet'
    }
  },
  methods: {
    reset () {
      this.isCapture = true
    },
    takePhoto () {
      if (!this._hasUserMedia) {
        return
      }
      this.isCapture = false
    },
    getMediaDevices () {
      var md = navigator.mediaDevices
      if (md != null) {
        return md
      }
    },
    computeFrame () {
      this.ctx1.drawImage(this._video, 0, 0, this.width / 3, this.height / 3)
      let frame = this.ctx1.getImageData(0, 0, this.width / 3, this.height / 3)
      let l = frame.data.length / 4

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0]
        let g = frame.data[i * 4 + 1]
        let b = frame.data[i * 4 + 2]
        let avg = (r + g + b) / 3
        // 'a' a > 1 means more contrast and 0< a <1 means less contrast
        let a = 3
        let br = 100
        avg = a * (avg - 128) + 128 + br
        frame.data[i * 4 + 0] = avg
        frame.data[i * 4 + 1] = avg
        frame.data[i * 4 + 2] = avg
        frame.data[i * 4 + 3] = 255 - avg
      }
      this.ctx2.putImageData(frame, 0, 0)
    }
  },
  mounted () {
    if (process.browser) {
      window.onNuxtReady((app) => {
        this._refs = this.$refs
        this._video = this._refs.video
        this.ctx1 = this._refs.sigCanvas.getContext('2d')
        this.ctx2 = this._refs.edited.getContext('2d')
        let timerCallback = () => {
          if (!this._video.paused || !this._video.ended) {
            this.computeFrame()
            setTimeout(function () {
              timerCallback()
            }, 200)
          }
        }
        // this._video.addEventListener('play', function () {
        //   // self.width = self.video.videoWidth / 2
        //   // self.height = self.video.videoHeight / 2
        //   timerCallback()
        // }, false)
        // console.log('video: ', this._video)

        var md = this.getMediaDevices()
        md.getUserMedia({
          audio: false,
          video: {
            frameRate: 5,
            facingMode: 'environment',
            width: 1280,
            height: 720
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
        // .then(() => this.computeFrame())
        // .then((stream) => {
        //   // console.log(stream)
        //   this.optimizedPhoto = this._stream.captureStream(25)
        // })
      })
    }
  },
  beforeDestroy () {
    this._video.pause()
    this.src = null
    // this._stream.getTracks()[0].stop()
  },
  destroyed () {
    console.log('Destroyed')
  }
}
</script>
