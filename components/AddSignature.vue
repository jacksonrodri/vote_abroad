<template>
  <section>
        <div>
          <h3 class="title is-3">{{ $t('request.sig.title') }}</h3>
          <h3 v-if="canCaptureImage" class="subtitle is-4">
            <a class="has-text-primary" @click="() => {webcamCaptureError = false; webCamPic = null; croppedPic.remove(); startCameraFilePicker()}">Click start</a> to scan your signature now<span> with your device camera</span>. Or <a @click="croppedPic.chooseFile()" class="has-text-primary">upload a file</a> from your computer.
          </h3>
          <h3 v-else class="subtitle is-4">
            <a @click="croppedPic.chooseFile()" class="has-text-primary">Click to upload a scan of your signature</a> from your computer.
          </h3>
          <b-message :active="webcamCaptureError && !(croppedPic && croppedPic.imageSet)" :closable="false" title="Failed loading camera." type="is-danger">
            We could not get access your device camera. (Either it is not connected/available or you have disallowed VoteFromAbroad.org from accessing it). You can still click <a @click="croppedPic.chooseFile()" class="has-text-primary">upload a file</a> to upload your signature from a file.
          </b-message>
          <b-message :active="!webCamCapture && canCaptureImage && (!croppedPic || !croppedPic.imageSet)" :closable="false" title="Instructions" type="is-info">
            For best results, sign your name with a dark pen in large letters on a blank sheet of white paper. Then click 'Start'.
          </b-message>
          <b-message :active="!webCamCapture && !canCaptureImage && (!croppedPic || !croppedPic.imageSet)" :closable="false" title="Instructions" type="is-info">
            For best results, sign your name with a dark pen in large letters on a blank sheet of white paper. Scan the file to your computer, then click 'Upload a File'.
          </b-message>
          <b-message :active="webCamCapture && !webcamCaptureError" :closable="false" title="Instructions" type="is-info">
            Move your signature in front of the camera so that it is in focus and takes up as much of the screen as possible.
          </b-message>
          <b-message :active="!webCamCapture && croppedPic && croppedPic.imageSet" :closable="false" title="Instructions" type="is-info">
            - Align your signature with the red line -- drag to move, scroll to zoom. If you don't see your signature, you may need to zoom out to get it back on the page.<br>- Adjust your signature with the 'Line Strength' buttons below so that the signature is clear and has minimal background noise<br>- If your signature is still unclear, you can click 'Clear Image' to try again.<br>- Click 'Use This Signature' to add it to your form and compose a message to your election official.
          </b-message>
            <get-camera ref="webcam" @captureError="captureError" :isCapturing="webCamCapture" v-show="webCamCapture" @updatePic="drawThresholdToCanvas"></get-camera>
            <signature-cropper
              v-show="!webCamCapture"
              :style="!croppedPic || !croppedPic.imageSet ? 'background: whitesmoke; background-image:none;': ''"
              v-model="croppedPic"
              ref="cp"
              :placeholder="canCaptureImage ? 'Click to Start' : 'Upload a File'"
              accept="image/*"
              :zoom-speed="2"
              :auto-sizing="true"
              :input-attrs="{capture: true, class: 'file-input'}"
              :show-loading="true"
              :disable-click-to-choose="device && device.inputCaptureSupported ? false : true"
              :replace-drop="true"
              :quality="device.type === 'mobile' && device.orientation === 'portrait' ? 4 : 2"
              @click="() => { if (!canCaptureImage) { croppedPic.chooseFile() } if (!croppedPic || !(croppedPic.hasImage())) { startCameraFilePicker() } }"
              @init.once="$refs.cp.refresh()"
              @image-remove="webCamPic = null"
              @file-choose="drawFromFile"
              @new-image="drawThresholdToCanvas"
              @draw="onDraw"
              :initial-image="thresholdedPic"
              initial-size="cover">
              <img slot="intitial" :src="webCamPic" />
            </signature-cropper>
            <b-field>
              <b-field grouped>
                <b-field v-if="croppedPic && croppedPic.imageSet">
                  <button :class="['button', 'is-light', 'is-medium', {'is-loading': false}]"
                    @click.prevent="() => {webCamPic = null; croppedPic.remove();}"
                    :disabled="!croppedPic || !croppedPic.imageSet">
                    Clear Image
                  </button>
                </b-field>
                <b-field expanded>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    v-if="croppedPic && croppedPic.imageSet"
                    @click.prevent="useSignature"
                    :disabled="!croppedPic || !croppedPic.imageSet">
                    Use This Signature
                    <!-- {{$t('request.sig.sendEmail')}} -->
                  </button>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    @click="() => { if ($refs && $refs.webcam) $refs.webcam.takePhoto() }"
                    v-else-if="webCamCapture && !webcamCaptureError">
                    Take Photo
                  </button>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    @click="croppedPic.chooseFile()"
                    v-else-if="webcamCaptureError || !canCaptureImage">
                    Upload a File
                  </button>
                  <!-- <a @click="croppedPic.chooseFile()" class="has-text-primary">upload a file</a> -->
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    v-else
                    @click.prevent="() => {webCamPic = null; croppedPic.remove(); startCameraFilePicker()}">
                    Start
                  </button>
                </b-field>
              </b-field>
            </b-field>
            <!-- <button v-if="croppedPic && croppedPic.hasImage()" class="button" @click.prevent="useSignature">Add my Signature</button> -->
              <div class="box" v-if="croppedPic && croppedPic.hasImage()" >
                <h3 class="subtitle is-5">
                  <span class="icon is-small">
                    <i class="fas fa-sliders-h"></i>
                  </span>
                  &nbsp;&nbsp;Adjust Image
                </h3>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Resize</label>
                  </div>
                  <div class="field-body">
                    Pinch or scroll on the image to resize it.
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Move</label>
                  </div>
                  <div class="field-body">
                    Drag to place your signature on the red line next to the 'X'.
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Rotate</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control is-expanded">
                        <a @click="rotate(-1)" :class="['button', 'is-fullwidth', {'is-small': device.type === 'mobile'}]">
                          <span class="icon is-small">
                            <i class="fas fa-undo"></i>
                          </span>
                          <span>Rotate Left</span>
                        </a>
                      </p>
                    </div>
                    <div class="field">
                      <p class="control is-expanded">
                        <a @click="rotate(1)" :class="['button', 'is-fullwidth', {'is-small': device.type === 'mobile'}]">
                          <span class="icon is-small">
                            <i class="fas fa-redo"></i>
                          </span>
                          <span>Rotate Right</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">
                      <span>Line Strength</span>
                    </label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control is-expanded">
                        <a @click="increaseCompensation" :class="['button', 'is-fullwidth', {'is-small': device.type === 'mobile'}]">
                          <span class="icon is-small">
                            <i class="fas fa-minus"></i>
                          </span>
                          <span>Lighter</span>
                        </a>
                      </p>
                    </div>
                    <div class="field">
                      <p class="control is-expanded">
                        <a @click="decreaseCompensation" :class="['button', 'is-fullwidth', {'is-small': device.type === 'mobile'}]">
                          <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                          </span>
                          <span>Darker</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
        </div>
  </section>
</template>

<script>
import GetCamera from '~/components/GetCamera'
import { mapState } from 'vuex'
// import ImageTools from '~/assets/imageTools.js'
const savePixels = require('save-pixels')
const getPixels = require('get-pixels')
const adaptiveThreshold = require('adaptive-threshold')
// var blur = require('ndarray-gaussian-filter')

export default {
  components: {
    GetCamera
  },
  props: ['value'],
  data () {
    return {
      croppedPic: null,
      webCamPic: null,
      thresholdedPic: null,
      webCamCapture: false,
      sigLine: null,
      size: 24,
      compensation: 7,
      inputCaptureSupported: false,
      webcamCaptureError: false,
      metadata: null,
      blurred: null,
      imageNotSetClass: { background: 'whitesmoke', maxWidth: '640px', width: '100%', paddingBottom: '25%', position: 'relative' },
      imageSetClass: { background: 'url(/sigLine.png) no-repeat cover', maxWidth: '640px', width: '100%', paddingBottom: '25%', position: 'relative' },
      buttonClass: {
        button: true,
        'is-primary': true,
        'is-medium': true,
        'is-fullwidth': true
      }
    }
  },
  computed: {
    device () { return this.$store.state.userauth.device },
    ...mapState({
      canCaptureImage: state => state.userauth.device.hasWebCam
    })
  },
  methods: {
    captureError () {
      this.webcamCaptureError = true
    },
    useSignature () {
      // let pic = this.croppedPic.getCanvas().toDataURL()
      this.$emit('sigcap', this.croppedPic.generateDataUrl())
    },
    startCameraFilePicker () {
      // console.log(this)
      if (!this.croppedPic || !this.croppedPic.hasImage()) {
        if (this.device && !this.device.inputCaptureSupported) {
          this.thresholdedPic = null
          this.webCamCapture = true
        } else { this.captureSignature() }
      }
    },
    captureSignature () {
      this.croppedPic.chooseFile()
    },
    rotate (val) {
      this.croppedPic.rotate(val)
    },
    increaseCompensation () {
      this.metadata = this.croppedPic.getMetadata()
      this.thresholdedPic = null
      this.compensation = this.compensation + 3
      this.size = this.size + 3
      this.drawThresholdToCanvas(null)
    },
    decreaseCompensation () {
      this.metadata = this.croppedPic.getMetadata()
      this.thresholdedPic = null
      this.compensation = this.compensation - 3
      this.size = this.size - 3
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
      this.thresholdedPic = null
      // let vm = this
      let reader = new FileReader()
      reader.onload = () => {
        // console.log(reader.result)
        let img = new Image()
        img.onload = () => {
          let maxWidth = 1280
          let maxHeight = 720
          // console.log(img)
          let width = img.width
          let height = img.height
          let isTooLarge = false

          if (width >= height && width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
            isTooLarge = true
          } else if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
            isTooLarge = true
          }

          if (!isTooLarge) {
            // return file here
            this.webCamPic = reader.result
            this.drawThresholdToCanvas(reader.result)
          } else {
            let canvas = document.createElement('canvas')
            canvas.width = width > height ? width : height
            canvas.height = width > height ? height : width
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            if (width < height) {
              ctx.rotate(-Math.PI / 2)
            }
            this.drawThresholdToCanvas(canvas.toDataURL())
          }
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    },
    drawThresholdToCanvas (imgUrl) {
      if (!this.thresholdedPic) {
        this.webCamCapture = false
        this.webCamPic = imgUrl || this.webCamPic
        getPixels(imgUrl || this.webCamPic, (err, pixels) => {
          if (err) {
            window.alert('Error.')
            throw err
          }
          let thresholded = adaptiveThreshold(pixels, {size: this.size, compensation: this.compensation})
          let cnv = savePixels(thresholded, 'canvas') // returns canvas element
          let ctx = cnv.getContext('2d')
          let imgData = ctx.getImageData(0, 0, cnv.width, cnv.height)
          for (let x = 3; x < imgData.data.length; x += 4) {
            imgData.data[x] = Math.abs(255 - imgData.data[x - 1])
          }
          // imgData.data = boxBlur(imgData.data, cnv.width, cnv.height, 5, 2)
          ctx.putImageData(imgData, 0, 0)
          // console.log(imgData)
          this.thresholdedPic = cnv.toDataURL()
          this.croppedPic.refresh()
        })
      }
    },
    onDraw: function (ctx) {
      console.log('canvas style', this.croppedPic.getCanvas().style)
      // console.log(ctx.canvas)
      // console.log(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))
      // let sigImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      // let edited1 = this.editImg(sigImage, ctx.canvas.width, ctx.canvas.height, 0, 20)
      // ctx.putImageData(edited1, 0, 0)
      ctx.save()
      ctx.globalAlpha = 0.9
      // ctx.drawImage(this.sigLine, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, 480, 150)
      // ctx.drawImage(this.sigLine, 0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.restore()
      if (this.metadata) this.croppedPic.applyMetadata(this.metadata)
      this.metadata = null
    },
    editImg: function (imgData, canvasWidth, canvasHeight, lowerBound, upperBound) {
      var data = imgData.data.slice()
      // console.log(data)
      let monoData = []
      for (var i = 0; i < data.length; i += 4) {
        monoData[i / 4] = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3)
      }
      // console.log(monoData)
      let sorted = monoData.slice().sort()
      // console.log(sorted)
      let lowerBoundPix = sorted[Math.floor(lowerBound / 100 * monoData.length)]
      let upperBoundPix = sorted[Math.floor(upperBound / 100 * monoData.length)]
      // console.log(lowerBound, lowerBoundPix, upperBound, upperBoundPix)

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
    // this.mtd = true
    // this.croppedPic.refresh()
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
  background: no-repeat url(/sigLine.png);
  background-size: cover;
  max-width: 640px;
  width: 100%;
  padding-bottom: 25%;
  position: relative;
}
.croppa-container > canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
