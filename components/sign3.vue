<template>
<div>
  <div class="card" v-if="signStep">
    <div class="card-content">
      <!-- <button class="button is-primary is-medium" @click="startCamera">Start my camera</button> -->
      <div v-if="signStep==='instructions'" class="signature">
        <div class="signatureline"></div>
        <div style="position:relative;">
          <video v-show="isCapture"
            style="position:absolute;top:0;right:0;z-index:-1;"
            @play="timerCallback()"
            v-bind:width="width"
            v-bind:height="height"
            :autoplay="autoplay"
            :playsinline="playsinline"
            :controls="controls"
            ref="video"></video>

            <!-- style="width: 1px; height: 1px; margin -1px; filter: grayscale(100%) brightness(200%) contrast(100%)" -->
          <canvas ref="sigCanvas"
            style="position:absolute;background-image:url('/fpca_sign.png');background-size:cover;opacity:0;"
            v-bind:width="width"
            v-bind:height="height"
            v-show="true"></canvas>
          <canvas ref="edited"
            v-bind:width="width"
            v-bind:height="height"
            v-on:click="takePhoto"
            style="position:absolute;background-image:url('/fpca_sign.png');background-size:cover;opacity:0;"></canvas>
          <div ref="glfilter" id="gl"></div>
        </div>
      </div>

      <!-- <b-collapse v-if="isSigningActive" class="card is-shadowless" :open.sync="isEditing">
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
            <output for="brightnessSlider">{{ brightness }}</output>
            <h2 class="subtitle is-6">Contrast (decrease until signature is clearly visible)</h2>
            <input id="contrastSlider" class="slider has-output is-fullwidth" min="0" max="300" v-model="contrast" step="1" @input="computeFrame" type="range">
            <output for="contrastSlider">{{ contrast }}</output>
          </div>
        </div>
      </b-collapse> -->
    </div>
    <footer v-if="isSigningActive" class="card-footer">
      <p class="card-footer-item">
        <a v-if="!isCapture" class="is-primary" v-on:click="reset">Take Another</a>
        <a v-if="isCapture" class="is-primary" v-on:click="takePhoto">Take Photo</a>
      </p>
      <p  v-if="!isCapture" class="card-footer-item">
        <a class="is-primary" v-on:click="save">Save</a>
      </p>
    </footer>
  </div>
</div>
</template>

<script>
import slider from '~/components/slider'
// require('WebGLImageFilter/webgl-image-filter')
require('~/assets/filter')
// import * as jsfeat from 'jsfeat'
// eslint-disable-line

export default {
  // head () {
  //   return {
  //     script: [
  //       { src: 'https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js' }
  //     ]
  //   }
  // },
  props: [
    'signStep'
  ],
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
      ctx2: null,
      isCapture: true,
      isEditing: false,
      details: 'nothing yet',
      paused: true,
      isSigningActive: false,
      filter: null,
      hasWebGlCanvas: false,
      computeAnimationFrame: null,
      filteredImage: null
    }
  },
  computed: {
    cont () { return Math.exp(parseInt(this.contrast) / 100) },
    br () { return parseInt(this.brightness) }
  },
  watch: {
    signStep (val) {
      if (val === 'instructions') {
        // console.log('instructions Step')
        this.cameraInstructions()
      }
    }
  },
  // watch: {
  //   paused (newVal, oldVal) {
  //     if (newVal === false) {
  //       this.timerCallback()
  //     }
  //   }
  // },
  methods: {
    cameraInstructions () {
      this.$dialog.confirm({
        title: 'Instructions',
        message: `<h1 class="title is-5">I swear or affirm, under penalty of purjury that:</h1>
        <div class="content">
        <ol>
          <li>Click 'Accept' to allow access to your camera.</li>
          <li>Sign your name with a dark pen on a sheet of plain white paper.</li>
          <li>Click 'capture' to take a picture of you signature</li>
          <li>Select the clearest version</li>
        </ol>
        </div>`,
        confirmText: 'Allow access to your camera',
        type: 'is-success',
        onConfirm: this.startCamera()
      })
    },
    save () {
      var gl = this.filteredImage.getContext('webgl')
      var ctx = this.ctx1

      var width = gl.drawingBufferWidth
      var height = gl.drawingBufferHeight
      var pixels = new Uint8Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

      var halfHeight = height / 2 | 0 // the | 0 keeps the result an int
      var bytesPerRow = width * 4

      // make a temp buffer to hold one row
      var temp = new Uint8Array(width * 4)
      for (var y = 0; y < halfHeight; ++y) {
        var topOffset = y * bytesPerRow
        var bottomOffset = (height - y - 1) * bytesPerRow

        // make copy of a row on the top half
        temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow))

        // copy a row from the bottom half to the top
        pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow)

        // copy the copy of the top half row to the bottom half
        pixels.set(temp, bottomOffset)
      }
      // console.log(pixels)
      var sorted = pixels.slice().sort()
      var len = pixels.length
      // let thresholds = [1, 3, 5, 8, 11, 15]
      // console.log(thresholds)

      function createImage (threshold) {
        let brightnessThreshold = Math.floor(len * threshold / 100)
        pixels.forEach((p, i, a) => {
          if ((i + 1) % 4 === 0) {
            let avg = (a[i - 3] + a[i - 2] + a[i - 1]) / 3
            if (i <= width * height * 4 * 0.3 || avg > sorted[brightnessThreshold]) {
              pixels[i] = 0
            } else {
              pixels[i] = 255 - ((255 - avg) / 2)
              pixels[i - 1] = 0
              pixels[i - 2] = 0
              pixels[i - 3] = 0
            }
          }
        })
        var imgd = new ImageData(width, height)
        imgd.data.set(pixels)
        return imgd
      }

      // This part is not part of the answer. It's only here
      // to show the code above worked
      // copy the pixels in a 2d canvas to show it worked
      var imgdata = createImage(1)
      ctx.putImageData(imgdata, 0, 0)
      this.optimizedPhoto = ctx.canvas.toDataURL('image/png')
      this.$emit('sigcap', this.optimizedPhoto)
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
      this.ctx1 = this._refs.sigCanvas.getContext('2d')
      this._ctx = this._refs.edited.getContext('2d')
      // console.log(this.$refs.video.paused)
      if (!this.$refs.video.paused) {
        // this.computeFrame()
        // this.timerCallback()
        this.computeAnimationFrame = window.requestAnimationFrame(() => {
          // if (this.$refs.video.paused) { this.timerCallback() }
          this.computeFrame()
          this.timerCallback()
        })
      } else {
        // console.log('video ended')
      }
    },
    computeFrame () {
      // let tracking = window.tracking
      let videoWidth = this.width
      let videoHeight = this.height
      // let sourceX = 0
      // let sourceY = 0
      // let sourceW = videoWidth
      // let sourceH = videoHeight
      // let destX = 0
      // let destY = 0
      // let destW = videoWidth
      // let destH = videoHeight
      if (this.isCapture) {
        this.ctx1.drawImage(this.$refs.video, videoWidth / 4, videoHeight / 4, videoWidth / 2, videoHeight / 2, 0, 0, videoWidth, videoHeight)
        // console.log(this.$refs.video)
        let imageData = this.ctx1.getImageData(0, 0, videoWidth, videoHeight)
        // console.log('image', imageData)
        this.filteredImage = this.filter.apply(imageData)
        if (!this.hasWebGlCanvas) {
          this.$refs.glfilter.appendChild(this.filteredImage)
          this.hasWebGlCanvas = true
        }
        // this.$refs.sigCanvas = this.filter.apply(this.$refs.video)

        // let igl = filteredImage.getContext('webgl')
        // var pixels = new Uint8Array(igl.drawingBufferWidth * igl.drawingBufferHeight * 4)
        // igl.readPixels(0, 0, igl.drawingBufferWidth, igl.drawingBufferHeight, igl.RGBA, igl.UNSIGNED_BYTE, pixels)
        // console.log(pixels)
        // pixels = Uint8ClampedArray.from(pixels)
        // let imageData2 = new ImageData(pixels, videoWidth, videoHeight)
        // imageData2.data = pixels
        // console.log(imageData2)
        // // console.log(filteredImage.toDataURL())
        // let img = filteredImage.getImageData(0, 0, videoWidth, videoHeight)
        // this.ctx1.putImageData(imageData2, 0, 0)
        // let gl = filteredImage.getContext('webgl')
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        // this.ctx1.drawImage(filteredImage, 0, 0)
        // let dataBuffer = new jsfeat.data_t(videoWidth * videoHeight, imageData.data.buffer) // eslint-disable-line new-cap
        // let mat = new jsfeat.matrix_t(videoWidth, videoHeight, jsfeat.U8_t | jsfeat.C4_t, dataBuffer) // eslint-disable-line new-cap
        // var gray = new jsfeat.matrix_t(mat.cols, mat.rows, jsfeat.U8_t | jsfeat.C1_t) // eslint-disable-line new-cap
        // jsfeat.imgproc.grayscale(mat.data, mat.cols, mat.rows, gray)
        // // console.log('imageData', imageData)
        // console.log('gray', gray)
        // let imageData2 = new ImageData(mat.cols, mat.rows)
        // let data = Uint32Array.from(imageData2.data)
        // var alpha = (0xff << 24)
        // var i = mat.cols * mat.rows
        // var pix = 0
        // while (--i >= 0) {
        //   pix = gray.data[i]
        //   data[i] = alpha | (pix << 16) | (pix << 8) | pix
        // }
        // console.log('imageData2', imageData2)
        // this.ctx1.putImageData(imageData2, 0, 0)

        // let imageData2 = new ImageData(videoWidth, videoHeight)
        // var data = Uint32Array.from(imageData2.data.buffer)
        // var alpha = (0xff << 24)
        // var i = gray.cols * gray.rows
        // var pix = 0
        // while (--i >= 0) {
        //   pix = gray[i]
        //   data[i] = alpha | (pix << 16) | (pix << 8) | pix
        // }
        // console.log(data)
        // this.ctx1.putImageData(imageData2, 0, 0)
      }
    },
    startCamera () {
      this.isSigningActive = true
      this._refs = this.$refs
      this._video = this._refs.video
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
          // console.log('this from stream: ', this)
          this._refs.video.srcObject = stream
          this._stream = stream
          this._hasUserMedia = true
          // console.log(this.paused)
          this._refs.video.addEventListener('canplay', () => {
            // console.log('canplay', this._refs.video)
            this.width = this._refs.video.videoWidth
            this.height = this._refs.video.videoHeight
            // this.width = 1280
            // this.height = 720
            // this.timerCallback()
            this.paused = false
            this._refs.video.play()
          })
        }, (err) => {
          console.error(err)
        })
    }
  },
  mounted () {
    this._refs = this.$refs
    this._video = this._refs.video
    try {
      this.filter = new window.WebGLImageFilter()
    } catch (err) {
      // Handle browsers that don't support WebGL
      console.error(err)
    }

    // this.filter.addFilter('hue', 180)
    // this.filter.addFilter('blur', 3)
    // this.filter.addFilter('negative')
    // this.filter.addFilter('contrast', 5)
    // this.filter.addFilter('negative')
    //     ;White to Alpha
    // ColorMatrix1=1;0;0;-1;0
    // ColorMatrix2=0;1;0;-1;0
    // ColorMatrix3=0;0;1;-1;0

    this.filter.addFilter('blur', 1)
    // this.filter.addFilter('detectEdges')
    // this.filter.addFilter('emboss', 1)
    // this.filter.addFilter('sobelX')
    // this.filter.addFilter('sobelY')
    // this.filter.addFilter('blur', 3)
    // this.filter.addFilter('convolution', [
    //   -3, 0, 3, -10, 0, 10, -3, 0, 3
    // ])
    this.filter.addFilter('desaturateLuminance')
    // this.filter.addFilter('contrast', 0.3)
    // this.filter.addFilter('negative')
    // this.filter.addFilter('blur', 3)
    // this.filter.addFilter('brightness', -0.5)
    // this.filter.addFilter('colorMatrix', [
    //   0.65, 0.65, 0.65, 0, -96,
    //   0.65, 0.65, 0.65, 0, -96,
    //   0.65, 0.65, 0.65, 0, -96,
    //   -0.5, -0.5, -0.5, 0, 400
    // ])
    // this.filter.addFilter('colorMatrix', [
    //   -1.4, -1.4, -1.4, 0, 255,
    //   -1.4, -1.4, -1.4, 0, 255,
    //   -1.4, -1.4, -1.4, 0, 255,
    //   -0.33, -0.33, -0.33, 0, 255
    // ])
    // this.filter.addFilter('negative')
    // this.filter.addFilter('desaturate')
    // this.filter.addFilter('emboss', 5)
    // this.filter.addFilter('blur', 3)
    // this.filter.addFilter('brightness', -0.4)
    // this.filter.addFilter('contrast', 6)
  //   this._refs = this.$refs
  //   this._video = this._refs.video
  //   this.ctx1 = this._refs.sigCanvas.getContext('2d')
  //   this._ctx = this._refs.edited.getContext('2d')
  //   console.log('video: ', this._video)

  //   var md = this.getMediaDevices()
  //   md.getUserMedia({
  //     audio: false,
  //     video: {
  //       facingMode: 'environment',
  //       width: 1280,
  //       height: 720,
  //       aspectRatio: 1.7777777778
  //     }
  //   })
  //     .then((stream) => {
  //       this.src = stream
  //       this._video.srcObject = stream
  //       this._stream = stream
  //       this._hasUserMedia = true
  //       console.log(this.paused)
  //       this._video.addEventListener('canplay', () => {
  //         console.log('canplay', this._video)
  //         this.width = this._video.videoWidth
  //         this.height = this._video.videoHeight
  //         // this.width = 1280
  //         // this.height = 720
  //         // this.timerCallback()
  //         this.paused = false
  //         this._video.play()
  //       })
  //     }, (err) => {
  //       console.log(err)
  //     })
  },
  beforeDestroy () {
    if (this.$refs.video) {
      this.$refs.video.pause()
      this.src = null
      this._stream.getTracks()[0].stop()
      this.filter.reset()
      this.isCapture = false
    }
    if (this.computeAnimationFrame) {
      cancelAnimationFrame(this.computeAnimationFrame)
    }
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
#gl {
  position: relative;
}
#gl:after {
  content: "";
  position:absolute;
  background-image:url('/fpca_sign.png');
  background-size: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
