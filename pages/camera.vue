<template>
  <section class="section">
    <!-- <get-camera></get-camera> -->
    <div class="columns is-centered">
      <div class="column is-half">
        <!-- <h3 class="title is-3">Upload a photo of your signature or <a class="button" @click="webCamCapture = !webCamCapture">click here</a> to use your device camera to scan your signature now.</h3> -->
        <h3 class="title is-3">Add your scanned signature.</h3>
        <h3 class="subtitle is-4">You can upload a photo of your signature or <a class="has-text-primary" @click="webCamCapture = !webCamCapture">Click here</a> to use your device camera to capture it.</h3>
        <!-- <h3 class="subtitle is-4">- or -</h3> 0-->
        <!-- <h3 class="subtitle is-4">or <a class="has-text-primary" @click="webCamCapture = !webCamCapture">Click here</a> to use your device camera to capture it.</h3> -->
        <!-- <div style="position:relative;"></div> -->

        <get-camera :isCapturing="webCamCapture" v-show="webCamCapture" @updatePic="drawThresholdToCanvas"></get-camera>
        <signature-cropper
          v-show="!webCamCapture"
          v-model="croppedPic"
          accept="image/*"
          :zoom-speed="2"
          :input-attrs="{capture: true, class: 'file-input'}"
          placeholder="Click to choose a photo of your signature."
          :placeholder-font-size="24"
          :width="320"
          :show-loading="true"
          :replace-drop="true"
          :height="150"
          :quality="3"
          @image-remove="webCamPic = null"
          @file-choose="drawFromFile"
          @draw="onDraw"
          :initial-image="thresholdedPic"
          initial-size="contain">
          <img slot="intitial" :src="webCamPic" />
        </signature-cropper>
        <div class="section">
          <h3 class="subtitle">Edit</h3>
          <a @click="increaseCompensation" class="button">Increase Threshold</a>
          <a @click="decreaseCompensation" class="button">Decrease Threshold</a>
          <a @click="rotate(-1)" class="button">Rotate Left</a>
          <a @click="rotate(1)" class="button">Rotate Right</a>
        </div>
        <!-- <a @click="increaseSize" class="button">Increase Size</a>
        <a @click="decreaseSize" class="button">Decrease Size</a> -->
        <!-- <div class="cover-container"></div> -->
      </div>
    </div>
  </section>
</template>

<script>
import GetCamera from '~/components/GetCamera'
const savePixels = require('save-pixels')
const getPixels = require('get-pixels')
const adaptiveThreshold = require('adaptive-threshold')

export default {
  components: {
    GetCamera
  },
  data () {
    return {
      croppedPic: null,
      webCamPic: null,
      thresholdedPic: null,
      webCamCapture: false,
      sigLine: null,
      size: 7,
      compensation: 7,
      metadata: null
    }
  },
  methods: {
    rotate (val) {
      this.croppedPic.rotate(val)
    },
    increaseCompensation () {
      this.metadata = this.croppedPic.getMetadata()
      this.compensation = this.compensation + 1
      this.size = this.size + 1
      this.drawThresholdToCanvas(null)
    },
    decreaseCompensation () {
      this.metadata = this.croppedPic.getMetadata()
      this.compensation = this.compensation - 1
      this.size = this.size - 1
      this.drawThresholdToCanvas()
    },
    increaseSize () {
      this.metadata = this.croppedPic.getMetadata()
      this.size = this.size + 1
      this.drawThresholdToCanvas()
    },
    decreaseSize () {
      this.metadata = this.croppedPic.getMetadata()
      this.size = this.size - 1
      this.drawThresholdToCanvas()
    },
    drawFromFile (file) {
      let reader = new FileReader()
      reader.addEventListener('load', () => {
        this.drawThresholdToCanvas(reader.result)
      }, false)
      reader.readAsDataURL(file)
    },
    drawThresholdToCanvas (imgUrl, w, h) {
      this.webCamPic = imgUrl || this.webCamPic
      getPixels(this.webCamPic, (err, pixels) => {
        if (err) {
          window.alert('Error.')
          throw err
        }
        let thresholded = adaptiveThreshold(pixels, {size: this.size, compensation: this.compensation})
        let cnv = savePixels(thresholded, 'canvas') // returns canvas element
        this.thresholdedPic = cnv.toDataURL()
        this.croppedPic.refresh()
        this.webCamCapture = false
      })
    },
    onDraw: function (ctx) {
      // console.log(ctx.canvas)
      // console.log(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))
      // let sigImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      // let edited1 = this.editImg(sigImage, ctx.canvas.width, ctx.canvas.height, 0, 20)
      // ctx.putImageData(edited1, 0, 0)
      ctx.save()
      ctx.globalAlpha = 0.9
      // ctx.drawImage(this.sigLine, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, 480, 150)
      ctx.drawImage(this.sigLine, 0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.restore()
      if (this.metadata) this.croppedPic.applyMetadata(this.metadata)
      this.metadata = null
    },
    editImg: function (imgData, canvasWidth, canvasHeight, lowerBound, upperBound) {
      var data = imgData.data.slice()
      console.log(data)
      let monoData = []
      for (var i = 0; i < data.length; i += 4) {
        monoData[i / 4] = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3)
      }
      console.log(monoData)
      let sorted = monoData.slice().sort()
      console.log(sorted)
      let lowerBoundPix = sorted[Math.floor(lowerBound / 100 * monoData.length)]
      let upperBoundPix = sorted[Math.floor(upperBound / 100 * monoData.length)]
      console.log(lowerBound, lowerBoundPix, upperBound, upperBoundPix)

      for (let i = 0; i < monoData.length; i++) {
        let adj
        if (monoData[i] < lowerBoundPix) {
          adj = 0
        } else if (monoData[i] > upperBoundPix) {
          adj = 255
        } else {
          adj = Math.floor(255 - ((upperBoundPix - monoData[i]) / (upperBoundPix - lowerBoundPix) * 255))
        }
        var alpha = 255 - adj
        data[i * 4] = adj // red
        data[i * 4 + 1] = adj // green
        data[i * 4 + 2] = adj // blue
        data[i * 4 + 3] = alpha // alpha
      }
      var imgd = new ImageData(1200, 800)
      imgd.data.set(data)
      return imgd
    }
  },
  mounted () {
    this.sigLine = new Image()
    this.sigLine.src = '/lineOnly.png'
  }
}
</script>

<style>
.sk-fading-circle {
  position: absolute; }
  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; }
  .sk-fading-circle .sk-circle .sk-circle-indicator {
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1s infinite ease-in-out both;
            animation: sk-circleFadeDelay 1s infinite ease-in-out both; }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
            transform: rotate(30deg); }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
            transform: rotate(60deg); }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
            transform: rotate(120deg); }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
            transform: rotate(150deg); }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
            transform: rotate(180deg); }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
            transform: rotate(210deg); }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
            transform: rotate(240deg); }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
            transform: rotate(270deg); }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
            transform: rotate(300deg); }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
            transform: rotate(330deg); }
  .sk-fading-circle .sk-circle2 .sk-circle-indicator {
    -webkit-animation-delay: -0.91667s;
            animation-delay: -0.91667s; }
  .sk-fading-circle .sk-circle3 .sk-circle-indicator {
    -webkit-animation-delay: -0.83333s;
            animation-delay: -0.83333s; }
  .sk-fading-circle .sk-circle4 .sk-circle-indicator {
    -webkit-animation-delay: -0.75s;
            animation-delay: -0.75s; }
  .sk-fading-circle .sk-circle5 .sk-circle-indicator {
    -webkit-animation-delay: -0.66667s;
            animation-delay: -0.66667s; }
  .sk-fading-circle .sk-circle6 .sk-circle-indicator {
    -webkit-animation-delay: -0.58333s;
            animation-delay: -0.58333s; }
  .sk-fading-circle .sk-circle7 .sk-circle-indicator {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s; }
  .sk-fading-circle .sk-circle8 .sk-circle-indicator {
    -webkit-animation-delay: -0.41667s;
            animation-delay: -0.41667s; }
  .sk-fading-circle .sk-circle9 .sk-circle-indicator {
    -webkit-animation-delay: -0.33333s;
            animation-delay: -0.33333s; }
  .sk-fading-circle .sk-circle10 .sk-circle-indicator {
    -webkit-animation-delay: -0.25s;
            animation-delay: -0.25s; }
  .sk-fading-circle .sk-circle11 .sk-circle-indicator {
    -webkit-animation-delay: -0.16667s;
            animation-delay: -0.16667s; }
  .sk-fading-circle .sk-circle12 .sk-circle-indicator {
    -webkit-animation-delay: -0.08333s;
            animation-delay: -0.08333s; }

@-webkit-keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0; }
  40% {
    opacity: 1; } }

@keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0; }
  40% {
    opacity: 1; } }

.croppa-container {
  display: inline-block;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  position: relative;
  font-size: 0;
  -ms-flex-item-align: start;
      align-self: flex-start;
  background-color: #e6e6e6;
}
.croppa-container canvas {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.croppa-container:hover {
  opacity: 0.7;
}
.croppa-container.croppa--dropzone {
  -webkit-box-shadow: inset 0 0 10px #333;
          box-shadow: inset 0 0 10px #333;
}
.croppa-container.croppa--dropzone canvas {
  opacity: 0.5;
}
.croppa-container.croppa--disabled-cc {
  cursor: default;
}
.croppa-container.croppa--disabled-cc:hover {
  opacity: 1;
}
.croppa-container.croppa--has-target {
  cursor: move;
}
.croppa-container.croppa--has-target:hover {
  opacity: 1;
}
.croppa-container.croppa--has-target.croppa--disabled-mz {
  cursor: default;
}
.croppa-container.croppa--disabled {
  cursor: not-allowed;
}
.croppa-container.croppa--disabled:hover {
  opacity: 1;
}
.croppa-container.croppa--passive {
  cursor: default;
}
.croppa-container.croppa--passive:hover {
  opacity: 1;
}
.croppa-container svg.icon-remove {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  -webkit-filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.7));
          filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.7));
  z-index: 10;
  cursor: pointer;
  border: 2px solid #fff;
}
.bAndW {
  filter: brightness(150%) contrast(130%) grayscale(100%)
}
.croppa-container {
  max-width:480px;
  max-height:150px;
  background: no-repeat url("/sigLine.png");
  background-color: transparent;
  border: 2px solid grey;
}
</style>
