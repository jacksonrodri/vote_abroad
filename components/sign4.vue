<template>
  <div>
    <transition name="fade" mode="out-in" v-on:after-enter="afterEnter">
      <div v-if="value === 'instructions'" key="instructions">
        <h3 class="title is-3">Instructions</h3>
        <div class="content">
        <ol>
          <li>Click 'Accept' to allow access to your camera.</li>
          <li>Sign your name with a dark pen on a sheet of plain white paper.</li>
          <li>Click 'capture' to take a picture of you signature</li>
          <li>Select the clearest version</li>
        </ol>
        </div>
        <button @click="updateStage('capture')" class="button">Allow access to my webcam</button>
      </div>
      <div v-if="value === 'capture'" key="capture">
        <h3 class="title is-3">Capture</h3>
        <div class="video">
          <video @play="timerCallback()"
              :autoplay="autoplay"
              :playsinline="playsinline"
              :controls="controls"
              ref="video"></video>
        </div>
        <button @click="takePhoto" class="button">Capture</button>
      </div>
      <div v-if="value === 'select'" key="select">
        <h3 class="title is-3">Select the clearest</h3>
        <ol>
          <li>Choose the version below with the clearest signature and whitest background</li>
        </ol>
        <canvas ref="signature1"
         :width="width * 4 / 5"
         :height="height / 2"
         @click="save"></canvas>
        <!-- <canvas ref="signature2"
         :width="width * 4 / 5"
         :height="height / 2"
         @click="save"></canvas>
        <canvas ref="signature3"
         :width="width * 4 / 5"
         :height="height / 2"
         @click="save"></canvas> -->
        <button @click="updateStage('capture')" class="button">Try again</button>
        <button @click="save" class="button">Save</button>
      </div>
      <div v-if="value === 'composeMessage'" key="composeMessage">
        <h3 class="title is-3">Send to your Local Election Official</h3>
        <ol>
          <li>Type a message to include with your email to your local election official.  We will attach your completed, signed and dated form. Click send to send the email. We will also send a copy to your email address for your records.</li>
        </ol>
        <section>
          <b-field horizontal label="Subject" type="is-danger" message="Please enter a subject">
            <b-input name="subject" expanded></b-input>
          </b-field>

          <b-field horizontal label="From">
            <b-input name="name" placeholder="Name" expanded></b-input>
            <b-input name="email" type="email" placeholder="nobody@nowhere.com" expanded></b-input>
          </b-field>

          <b-field horizontal label="Message">
            <b-input type="textarea"></b-input>
          </b-field>

          <b-field horizontal>
            <p class="control">
              <button class="button is-primary">
                Send message
              </button>
            </p>
          </b-field>
      </section>
      <section class="section">
        <div class="field">
          <label class="label">Attachment</label>
        </div>
        <figure class="image">
          <img v-if="fpca" :src="fpca || null">
        </figure>
      </section>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      autoplay: false,
      playsinline: true,
      controls: false,
      width: -1,
      height: -1,
      _refs: null,
      _stream: null,
      _hasUserMedia: false,
      src: null,
      paused: true,
      canvas: null,
      ctx: null,
      ctx1: null,
      ctx2: null,
      ctx3: null,
      sigImage: null,
      chosenSig: null
    }
  },
  props: [
    'value',
    'fpca'
  ],
  methods: {
    afterEnter: function (el) {
      console.log('el', el)
      if (this.value === 'capture') {
        this.startCamera()
      } else if (this.value === 'select') {
        this.drawSignatureSelections()
      } else if (this.value === 'choose') {
        console.log('choose')
      } else if (this.value === 'composeMessage') {
        console.log('chosen sig', this.chosenSig)
        this.$emit('sigcap', this.chosenSig)
      }
    },
    updateStage: function (stage) {
      if (this.$refs.video) {
        this.$refs.video.pause()
        this.src = null
        this._stream.getTracks()[0].stop()
      }
      this.$emit('input', stage)
    },
    getMediaDevices () {
      var md = navigator.mediaDevices
      if (md != null) {
        return md
      }
    },
    start () {
      setTimeout(() => {
        this.startCamera()
      }, 200)
    },
    startCamera: function () {
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
          this.$refs.video.srcObject = stream
          this._stream = stream
          this._hasUserMedia = true
          this.$refs.video.addEventListener('canplay', () => {
            this.width = this.$refs.video.videoWidth
            this.height = this.$refs.video.videoHeight
            this.paused = false
            this.$refs.video.play()
          })
        }, (err) => {
          console.log(err)
        })
    },
    timerCallback: function () {
      console.log('playing')
    },
    takePhoto: function () {
      if (!this._hasUserMedia) {
        return
      }
      this.$refs.video.pause()
      this.paused = true
      this.canvas.width = this.width
      this.canvas.height = this.height / 2
      this.ctx.drawImage(this.$refs.video, this.width / 5, this.height / 4, this.width * 4 / 5, this.height / 2, 0, 0, this.width, this.height / 2)
      this.sigImage = this.ctx.getImageData(0, 0, this.width, this.height / 2)
      this.updateStage('select')
    },
    drawSignatureSelections: function () {
      this.ctx1 = this.$refs.signature1.getContext('2d')
      // this.ctx2 = this.$refs.signature2.getContext('2d')
      // this.ctx3 = this.$refs.signature3.getContext('2d')
      let edited = this.editImg(this.sigImage, this.width, this.height / 2)
      this.ctx1.putImageData(edited, 0, 0)
      // this.ctx2.putImageData(edited, 0, 0)
      // this.ctx3.putImageData(edited, 0, 0)
    },
    editImg: function (imgData, canvasWidth, canvasHeight) {
      var data = imgData.data
      console.log(data)
      let sorted = imgData.data.slice().sort()
      let percentages = [1, 2, 3, 4, 5, 10]
      // let firstpercentile
      percentages.forEach((x) => {
        // if (x === 10) { firstpercentile = sorted[Math.floor(x / 100 * imgData.data.length)] }
        console.log('before- ' + x + '%: ' + sorted[Math.floor(x / 100 * imgData.data.length)] + ' item: ' + Math.floor(x / 100 * imgData.data.length))
      })
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        // let adj = (Math.pow((avg - 127) / 127, 3) + 1) * 127
        let adj
        if (avg < 80) {
          adj = 0
        } else if (avg > 140) {
          adj = 255
        } else {
          adj = Math.floor(255 - ((140 - avg) / 60 * 255))
        }
        // avg = avg > firstpercentile ? 255 : avg
        var alpha = 255 - adj
        data[i] = adj // red
        data[i + 1] = adj // green
        data[i + 2] = adj // blue
        data[i + 3] = alpha // alpha
      }
      let sorted2 = data.slice().sort()
      percentages.forEach((x) => {
        // if (x === 10) { firstpercentile = sorted[Math.floor(x / 100 * imgData.data.length)] }
        console.log('after-' + x + '%: ' + sorted2[Math.floor(x / 100 * imgData.data.length)] + ' item: ' + Math.floor(x / 100 * imgData.data.length))
      })
      var imgd = new ImageData(canvasWidth, canvasHeight)
      imgd.data.set(data)
      console.log('imgd', imgd)
      return imgd
      // console.log('buf', buf)
      // var data = Uint32Array.from(buf)
      // for (var y = 0; y < data.length; y++) {
      //   var value = buf[y * 4]
      //   var a = 255 - value
      //   data[y] =
      //   (a << 24) | // alpha
      //   (value << 16) | // blue
      //   (value << 8) | // green
      //   value // red
      // }
      // for (var y = 0; y < canvasHeight; ++y) {
      //   for (var x = 0; x < canvasWidth; x += 4) {
      //     var index = (y * canvasWidth + x) * 4
      //     var value = buf[index]
      //     data[y * canvasWidth + x] =
      //     (255 - value << 24) | // alpha
      //     (value << 16) | // blue
      //     (value << 8) | // green
      //     value // red
      //   }
      // }
      // var buf8 = Uint8ClampedArray.from(data)
      // var imgd = new ImageData(canvasWidth, canvasHeight)
      // imgd.data.set(buf8)
      // console.log(imgd)
      // return imgd
    },
    save: function (imgData) {
      console.log('save', this.ctx1.canvas.toDataURL())
      this.chosenSig = this.ctx1.canvas.toDataURL()
      this.updateStage('composeMessage')
    }
  },
  // watch: {
  //   value: function (val) {
  //     if (val === 'capture') {
  //       this.start()
  //     } else if (val === 'select') {
  //       setTimeout(() => {
  //         console.log('thisfromsettimeout', this)
  //         this.drawSignatureSelections()
  //       }, 2000)
  //     }
  //   }
  // },
  mounted: function () {
    console.log('mounted', this)
    // let c = document.createElement('canvas')
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  },
  beforeDestroy: function () {
    if (this.$refs.video) {
      this.$refs.video.pause()
      this.src = null
      this._stream.getTracks()[0].stop()
    }
  },
  destroyed: function () {
    console.log('Destroyed')
  }
}
</script>

<style>
.video {
  position: relative;
}
.video video {
  filter: grayscale(1) contrast(2)
}
.video:after {
  content: '';
  position: absolute;
  background-image: url('/signaturebg2.png');
  background-size: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

</style>
