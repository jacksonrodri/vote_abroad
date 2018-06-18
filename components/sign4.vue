<template>
  <div>
    <transition name="fade" mode="out-in" v-on:after-enter="afterEnter">
      <div v-if="value === 'instructions'" key="instructions">
        <h3 class="title is-3">{{$t('request.stages.instructions')}}</h3>
        <div class="content">
          <p v-html="$t('request.sig.instructions')"></p>
        <!-- <ol>
          <li>Click 'Accept' to allow access to your camera.</li>
          <li>Sign your name with a dark pen on a sheet of plain white paper.</li>
          <li>Click 'capture' to take a picture of you signature</li>
          <li>Select the clearest version</li>
        </ol> -->
        </div>
        <div class="buttons">
          <button @click="$emit('input', null)" class="button is-medium is-light">Cancel</button>
          <button @click="beginCapture" class="button is-medium is-primary">{{$t('request.sig.rtcConfirm')}}</button>
        </div>
      </div>
      <div v-if="value === 'capture'" key="capture">
        <h3 class="title is-3">{{$t('request.sig.capture')}}</h3>
        <!-- <h1 class="title">Width: {{width}} Height: {{height}}</h1> -->
        <div class="video" @click="takePhoto" :style="{cursor: !isLoading ? 'pointer' : ''}">
          <video @play="timerCallback()"
              :autoplay="autoplay"
              :playsinline="playsinline"
              :controls="controls"
              ref="video"></video>
          <b-loading :active.sync="isLoading"></b-loading>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button @click="$emit('input', null)" class="button is-medium is-light">Cancel</button>
          </div>
          <div class="control is-expanded">
            <button @click="takePhoto" class="button is-primary is-medium is-fullwidth">
              <span class="icon">
                <i class="fas fa-camera"></i>
              </span>
              <span>
                {{$t('request.sig.capture')}}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="value === 'select'" key="select">
        <h3 class="title is-3">{{$t('request.sig.select')}}</h3>
        <p>{{$t('request.sig.selectInstructions')}}</p>
        <!-- <h1 class="title">Width: {{width}} Height: {{height}}</h1> -->
        <!-- <ol>
          <li>Choose the version below with the clearest signature and whitest background</li>
        </ol> -->
        <canvas ref="signature1"
          id="sig1"
         :width="width"
         :height="height / 2"
         style="cursor:pointer;"
         @click="save('ctx1')"></canvas>
        <canvas ref="signature2"
          id="sig2"
         :width="width"
         :height="height / 2"
         style="cursor:pointer;"
         @click="save('ctx2')"></canvas>
        <canvas ref="signature3"
          id="sig3"
         :width="width"
         :height="height / 2"
         style="cursor:pointer;"
         @click="save('ctx3')"></canvas>
        <button @click="updateStage('capture')" class="button is-primary is-medium">{{$t('request.sig.retry')}}</button>
        <!-- <button @click="save('ctx1')" class="button">{{$t('request.sig.save')}}</button> -->
      </div>
      <div v-if="value === 'composeMessage'" key="composeMessage">
        <h3 class="title is-3">{{$t('request.sig.sendTitle')}}</h3>
        <p>{{$t('request.sig.sendInstructions')}}</p>
        <!-- <ol>
          <li>Type a message to include with your email to your local election official.  We will attach your completed, signed and dated form. Click send to send the email. We will also send a copy to your email address for your records.</li>
        </ol> -->
        <section>
          <b-field horizontal :label="$t('request.sig.subject')">
            <b-input v-model="subject" name="subject" :disabled="isMailing === true" expanded></b-input>
          </b-field>

          <b-field horizontal :label="$t('request.sig.from')">
            <b-input v-model="fromName" name="name" placeholder="Name" :disabled="isMailing === true" expanded></b-input>
            <b-input :value="email" name="email" type="email" placeholder="nobody@nowhere.com" disabled expanded></b-input>
          </b-field>

          <b-field horizontal :label="$t('request.sig.to')">
            <b-input :value="leoName" name="LeoName" placeholder="Name" disabled expanded></b-input>
            <b-input :value="leoEmail" name="LeoEmail" type="email" placeholder="nobody@nowhere.com" disabled expanded></b-input>
          </b-field>

          <b-field horizontal :label="$t('request.sig.message')">
            <b-input v-model="message" :disabled="isMailing === true" type="textarea" rows="12"></b-input>
          </b-field>

          <!-- <button class="button is-primary is-medium is-fullwidth" @click="sendEmail">
            Send Email
          </button> -->

          <b-field horizontal>
            <b-field grouped>
              <b-field>
                <button :class="['button', 'is-light', 'is-medium', {'is-loading': isMailing}]" @click="$emit('input', null)">
                  Cancel
                </button>
              </b-field>
              <b-field expanded>
                <button :class="[buttonClass, 'is-fullwidth', {'is-loading': isMailing}]" @click="sendEmail">
                  {{$t('request.sig.sendEmail')}}
                </button>
              </b-field>
            </b-field>
          </b-field>
      </section>
      <section class="section">
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">{{$t('request.sig.attachment')}}</label>
          </div>
          <div class="field-body">
            <figure class="field image" style="border: gray solid;">
              <img v-if="fpca" :src="fpca || null">
            </figure>
          </div>
        </div>
      </section>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

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
      chosenSig: null,
      fromName: null,
      subject: null,
      isMailing: false,
      message: null,
      isLoading: false,
      buttonClass: {
        button: true,
        'is-primary': true,
        'is-medium': true,
        'is-fullwidth': true
      }
    }
  },
  computed: {
    currentRequest () { return this.requests[this.currentRequestIndex] },
    firstName () { return this.currentRequest && this.currentRequest.firstName ? this.currentRequest.firstName : ' ' },
    lastName () { return this.currentRequest && this.currentRequest.lastName ? this.currentRequest.lastName : ' ' },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    tel () { return this.currentRequest && this.currentRequest.tel && this.currentRequest.tel.intNumber ? this.currentRequest.tel.intNumber : '' },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e ? this.currentRequest.leo.e : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n ? this.currentRequest.leo.n : ''
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  },
  props: [
    'value',
    'fpca'
  ],
  methods: {
    beginCapture: function () {
      this.isLoading = true
      var mql = window.matchMedia('(orientation: portrait)')
      if (mql.matches) {
        this.isLoading = false
        this.$dialog.alert({
          title: 'Please rotate your phone',
          message: 'Please rotate your phone to landscape orientation. (unlock orientation lock)',
          confirmText: 'OK',
          type: 'is-danger',
          hasIcon: true,
          icon: 'exclamation-circle',
          iconPack: 'fas'
        })
      } else {
        this.updateStage('capture')
      }
    },
    afterEnter: function (el) {
      // console.log('el', el)
      if (this.value === 'capture') {
        this.startCamera()
      } else if (this.value === 'select') {
        this.drawSignatureSelections()
      } else if (this.value === 'choose') {
        // console.log('choose')
      } else if (this.value === 'composeMessage') {
        // console.log('chosen sig', this.chosenSig)
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
      if (!md) {
        alert('Your browser does not allow access to your device camera.  Please try another browser or download, print sign and send your request to your local election official. (Note that third party browsers on iphone do not have access to the device camera.)')
        this.$emit('input', null)
        return
      }
      md.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: 1280,
          height: 720
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
            this.isLoading = false
            this.$refs.video.play()
          })
        }, (err) => {
          this.isLoading = false
          // console.log(err)
          alert(err)
        })
    },
    timerCallback: function () {
      // console.log('playing')
    },
    takePhoto: function () {
      if (!this._hasUserMedia) {
        return
      }
      this.$refs.video.pause()
      this.paused = true
      this.canvas.width = this.width
      this.canvas.height = this.height / 2
      this.ctx = this.canvas.getContext('2d')
      this.ctx.drawImage(this.$refs.video, this.width * 1 / 5, this.height / 5, this.width * 4 / 5, this.height / 2, 0, 0, this.width, this.height / 2)
      this.sigImage = this.ctx.getImageData(0, 0, this.width, this.height / 2)
      this.updateStage('select')
    },
    // drawSignatureSelections: function () {
    //   this.ctx1 = this.$refs.signature1.getContext('2d')
    //   this.ctx2 = this.$refs.signature2.getContext('2d')
    //   this.ctx3 = this.$refs.signature3.getContext('2d')
    //   let edited1 = this.editImg(this.sigImage, this.width, this.height / 2, 40, 100)
    //   let edited2 = this.editImg(this.sigImage, this.width, this.height / 2, 60, 120)
    //   let edited3 = this.editImg(this.sigImage, this.width, this.height / 2, 100, 160)
    //   this.ctx1.putImageData(edited1, 0, 0)
    //   this.ctx2.putImageData(edited2, 0, 0)
    //   this.ctx3.putImageData(edited3, 0, 0)
    // },
    // editImg: function (imgData, canvasWidth, canvasHeight, lowerBound, upperBound) {
    //   var data = imgData.data.slice()
    //   // console.log(data)
    //   // let sorted = imgData.data.slice().sort()
    //   // let percentages = [1, 2, 3, 4, 5, 10]
    //   // // let firstpercentile
    //   // percentages.forEach((x) => {
    //   //   // if (x === 10) { firstpercentile = sorted[Math.floor(x / 100 * imgData.data.length)] }
    //   //   console.log('before- ' + x + '%: ' + sorted[Math.floor(x / 100 * imgData.data.length)] + ' item: ' + Math.floor(x / 100 * imgData.data.length))
    //   // })
    //   for (var i = 0; i < data.length; i += 4) {
    //     var avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    //     // let adj = (Math.pow((avg - 127) / 127, 3) + 1) * 127
    //     let adj
    //     if (avg < lowerBound) {
    //       adj = 0
    //     } else if (avg > upperBound) {
    //       adj = 255
    //     } else {
    //       adj = Math.floor(255 - ((upperBound - avg) / (upperBound - lowerBound) * 255))
    //     }
    //     // avg = avg > firstpercentile ? 255 : avg
    //     var alpha = 255 - adj
    //     data[i] = adj // red
    //     data[i + 1] = adj // green
    //     data[i + 2] = adj // blue
    //     data[i + 3] = alpha // alpha
    //   }
    //   // let sorted2 = data.slice().sort()
    //   // percentages.forEach((x) => {
    //   //   // if (x === 10) { firstpercentile = sorted[Math.floor(x / 100 * imgData.data.length)] }
    //   //   console.log('after-' + x + '%: ' + sorted2[Math.floor(x / 100 * imgData.data.length)] + ' item: ' + Math.floor(x / 100 * imgData.data.length))
    //   // })
    //   var imgd = new ImageData(this.width, this.height / 2)
    //   imgd.data.set(data)
    //   // console.log('imgd', imgd)
    //   return imgd
    //   // console.log('buf', buf)
    //   // var data = Uint32Array.from(buf)
    //   // for (var y = 0; y < data.length; y++) {
    //   //   var value = buf[y * 4]
    //   //   var a = 255 - value
    //   //   data[y] =
    //   //   (a << 24) | // alpha
    //   //   (value << 16) | // blue
    //   //   (value << 8) | // green
    //   //   value // red
    //   // }
    //   // for (var y = 0; y < canvasHeight; ++y) {
    //   //   for (var x = 0; x < canvasWidth; x += 4) {
    //   //     var index = (y * canvasWidth + x) * 4
    //   //     var value = buf[index]
    //   //     data[y * canvasWidth + x] =
    //   //     (255 - value << 24) | // alpha
    //   //     (value << 16) | // blue
    //   //     (value << 8) | // green
    //   //     value // red
    //   //   }
    //   // }
    //   // var buf8 = Uint8ClampedArray.from(data)
    //   // var imgd = new ImageData(canvasWidth, canvasHeight)
    //   // imgd.data.set(buf8)
    //   // console.log(imgd)
    //   // return imgd
    // },
    drawSignatureSelections: function () {
      this.ctx1 = this.$refs.signature1.getContext('2d')
      this.ctx2 = this.$refs.signature2.getContext('2d')
      this.ctx3 = this.$refs.signature3.getContext('2d')
      let edited1 = this.editImg(this.sigImage, this.width, this.height / 2, 0, 5)
      let edited2 = this.editImg(this.sigImage, this.width, this.height / 2, 0.5, 12)
      let edited3 = this.editImg(this.sigImage, this.width, this.height / 2, 4, 20)
      this.ctx1.putImageData(edited1, 0, 0)
      this.ctx2.putImageData(edited2, 0, 0)
      this.ctx3.putImageData(edited3, 0, 0)
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
      var imgd = new ImageData(this.width, this.height / 2)
      imgd.data.set(data)
      return imgd
    },
    save: function (ctx) {
      // console.log('save', this[ctx].canvas.toDataURL())
      this.chosenSig = this[ctx].canvas.toDataURL()
      this.updateStage('composeMessage')
    },
    sendEmail () {
      this.isMailing = true
      // function dataURItoBlob (dataURI) {
      //   var byteString = atob(dataURI.split(',')[1])
      //   var ab = new ArrayBuffer(byteString.length)
      //   var ia = new Uint8Array(ab)
      //   for (var i = 0; i < byteString.length; i++) {
      //     ia[i] = byteString.charCodeAt(i)
      //   }
      //   return new Blob([ab], { type: 'image/png' })
      // }
      // var blob = dataURItoBlob(this.fpca)
      // console.log(blob)
      // let data = new FormData()
      // data.append('from', 'VoteFromAbroad <vote@mail.votefromabroad.org>')
      // data.append('to', this.email)
      // data.append('subject', this.subject)
      // data.append('text', this.message)
      // data.append('attachment', blob, '@file/fpca.png')
      // data.append('inline', blob, 'file/fpca.png')
      // data.append('html', `<html>This message will be sent to ${this.leoEmail} ${this.leoName} in production:<br/><br/> ${this.message} <br/><br/><img src="cid:fpca.png" width="120" alt="FPCA"><br/></html>`)
      // console.log(data.getAll())
      // for (var pair of data.entries()) {
      //   console.log(pair[0] + ', ' + pair[1])
      // }
      // data.append('html', `<html>This message will be sent to ${this.leoEmail} ${this.leoName} in production:<br/><br/> ${this.htmlMessage} <br/><br/><img src="cid:fpca.png" width="120" alt="FPCA"><br/></html>`)
      // data.append('o:tag', ['FPCA Submission', `LEO: ${this.leoName}`])
      // console.log(this)
      // this.$
      let headers = {}
      headers['Content-Type'] = 'application/json'
      headers['Accept'] = 'application/json'
      // headers['Access-Control-Allow-Origin'] = '*'
      // headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE,OPTIONS'
      // let allowHeaders = 'Referer,Accept,Origin,User-Agent,Content-Type'
      // headers['Access-Control-Allow-Headers'] = allowHeaders
      // : {
      //   ['Content-Type']: 'application/json',
      //   Accept: 'application/json'
      // }
      this.message = `********** \n This message will be sent to ${this.leoEmail} ${this.leoName} after VoteFromAbroad 3.0 is launched. \n\n We have NOT sent in your FPCA. \n ********** \n\n\n\n ${this.message}`
      let body = {subject: this.subject, email: this.email, message: this.message, htmlMessage: this.htmlMessage, leoName: this.leoName, leoEmail: this.leoEmail, image: this.fpca.toString()}
      console.log(typeof this.fpca)
      axios.post('http://localhost:3000/api/mailer', body, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          console.log(response.data)
          this.isMailing = false
          this.$toast.open({
            message: `Sent! Check your inbox for a copy (${this.email})`,
            type: 'is-success'
          })
          this.$router.push('/dashboard')
        })
        .catch(error => {
          console.log(error)
          this.isMailing = false
          this.$dialog.alert({
            title: 'Error Sending',
            message: 'There was an error sending your email. Please try again or return to the last page and download a copy.',
            confirmText: 'OK',
            type: 'is-danger',
            hasIcon: true,
            icon: 'error',
            iconPack: 'fas'
          })
        })
      // let url = 'http://localhost:3000/api/mail'
      // let url = 'https://votefromabroad.netlify.com/api/mail'
      // let config = { url: url, method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, auth: { username: 'api', password: 'key-44903961cb823b645750fe64358dfc40' } }
      // this.$axios.post(url, data, config)
      //   .then(response => {
      //     // console.log(response)
      //     this.$toast.open({
      //       message: `Sent! Check your inbox for a copy (${this.email})`,
      //       type: 'is-success'
      //     })
      //     this.$router.push('/dashboard')
      //   })
      //   .catch(errors => {
      //     this.isMailing = false
      //     this.$dialog.alert({
      //       title: 'Error Sending',
      //       message: 'There was an error sending your email. Please try again or return to the last page and download a copy.',
      //       confirmText: 'OK',
      //       type: 'is-danger',
      //       hasIcon: true,
      //       icon: 'error',
      //       iconPack: 'fas'
      //     })
      //     // console.log(errors)
      //   })
    }
  },
  mounted: function () {
    // console.log('mounted', this)
    // let c = document.createElement('canvas')
    this.canvas = document.createElement('canvas')
    this.fromName = `${this.firstName} ${this.lastName}`
    this.subject = 'FPCA Submission'
    this.message = `Please find my FPCA form for the 2018 calendar year. Can you confirm receipt and also confirm that I do not need to send in the paper copy? \n\nThank you so much for everything you do - your work is much appreciated by Americans abroad! \n\n Sincerely, \n\n${this.firstName} ${this.lastName} \n\n${this.email} \n\n${this.tel}`
    this.htmlMessage = `Please find my FPCA form for the 2018 calendar year. Can you confirm receipt and also confirm that I do not need to send in the paper copy? \n\nThank you so much for everything you do - your work is much appreciated by Americans abroad! <br/><br/> Sincerely, <br/><br/>${this.firstName} ${this.lastName} <br/><br/>${this.email} <br/><br/>${this.tel}`
  },
  beforeDestroy: function () {
    if (this.$refs.video) {
      this.$refs.video.pause()
      this.src = null
      this._stream.getTracks()[0].stop()
    }
  },
  destroyed: function () {
    // console.log('Destroyed')
  }
}
</script>

<style>
.video {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 28%
}
.video video {
  filter: grayscale(1) contrast(2);
  position: absolute;
  top: -35%;
  bottom: 0;
  left: 0;
  right: 0;
}
.video:after {
  content: '';
  position: absolute;
  background-image: url('/signaturebg2.png');
  background-size: cover;
  top: -35%;
  left: 0;
  width: 100%;
  height: 135%;
  z-index: 1;
}

</style>
