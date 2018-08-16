<template>
  <div>
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
        <b-input v-model="formEmail" ref="userEmail" name="email" type="email" :placeholder="$t('request.email.label')" :disabled="!!email" :required="Boolean(email)" expanded></b-input>
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
            <button :class="[buttonClass, 'is-fullwidth', {'is-loading': isMailing}]" @click.prevent="sendEmail">
              {{$t('request.sig.sendEmail')}}
            </button>
          </b-field>
        </b-field>
      </b-field>
  </section>
  <section class="section">
    <b-field v-if="documentRequired" horizontal label="Attachments">
      <b-upload
        accept="image/jpeg,image/gif,image/png,application/pdf"
        v-if="dropFiles.length === 0"
        @input="attachReqDoc"
        v-model="dropFiles"
        drag-drop>
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon
                icon="upload"
                size="is-large">
              </b-icon>
            </p>
            <p>You are required to provide {{documentRequired}}. Drop your file here or click to upload. (jpg, png, gif or pdf)</p>
          </div>
        </section>
      </b-upload>
      <div v-if="dropFiles.length === 1" class="tags">
        <span v-for="(file, index) in dropFiles"
          :key="index"
          class="tag is-primary is-large" >
          {{file.name}}
          <button class="delete is-small"
            type="button"
            @click="deleteDropFile(index)">
          </button>
        </span>
      </div>
    </b-field>

    <div class="field is-horizontal">
      <div class="field-label">
        <label v-if="!documentRequired" class="label">{{$t('request.sig.attachment')}}</label>
      </div>
      <div class="field-body">
        <figure class="field image" style="border: gray solid;">
          <img v-if="fpca" :src="fpca || null">
        </figure>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      customEmail: '',
      message: '',
      subject: '',
      htmlMessage: '',
      isMailing: false,
      dropFiles: [],
      reqDoc: '',
      sendWithoutDocs: false,
      buttonClass: {
        button: true,
        'is-primary': true,
        'is-medium': true,
        'is-fullwidth': true
      }
    }
  },
  computed: {
    formEmail: {
      get () { return this.email || this.customEmail },
      set (value) {
        this.customEmail = value
      }
    },
    currentRequest () { return this.requests[this.currentRequestIndex] },
    firstName () { return this.currentRequest && this.currentRequest.firstName ? this.currentRequest.firstName : ' ' },
    lastName () { return this.currentRequest && this.currentRequest.lastName ? this.currentRequest.lastName : ' ' },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : '' },
    tel () { return this.currentRequest && this.currentRequest.tel && this.currentRequest.tel.intNumber ? this.currentRequest.tel.intNumber : '' },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e ? this.currentRequest.leo.e : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n ? this.currentRequest.leo.n : ''
    },
    fromName () { return `${this.firstName} ${this.lastName}` },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  },
  props: [
    'value',
    'fpca',
    'documentRequired'
  ],
  methods: {
    attachReqDoc (files) {
      let vm = this
      // console.log(files, files.length, /\.(jpe?g|png|gif|pdf)$/i.test(files[0].name))
      if (files && files.length > 0 && files[0].name && /\.(jpe?g|png|gif|pdf)$/i.test(files[0].name)) {
        var reader = new FileReader()

        reader.addEventListener('load', function () {
          console.log(reader, this)
          vm.reqDoc = this.result
          vm.sendWithoutDocs = false
        }, false)

        reader.readAsDataURL(files[0])
      }
    },
    deleteDropFile (index) {
      this.dropFiles = []
      this.reqDoc = ''
      this.sendWithoutDocs = false
    },
    sendEmail () {
      if (this.documentRequired && !this.reqDoc && !this.sendWithoutDocs) {
        this.$dialog.confirm({
          title: this.documentRequired.toLocaleUpperCase(),
          message: `You are required to provide ${this.documentRequired}. Click cancel to add a file to your email. Or you can send the message without attaching a file. Your election official may contact you to ask for appropriate documentation.`,
          cancelText: 'Cancel',
          confirmText: 'Send Anyway',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => { this.sendWithoutDocs = true; this.sendEmail() }
        })
      } else if (!(this.formEmail.trim()) || !/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(this.customEmail)) {
        this.$refs.userEmail.checkHtml5Validity()
        console.log('email', this.formEmail.trim(), 'validity', /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(this.customEmail))
        console.log(this.$refs.userEmail)
      } else {
        this.isMailing = true
        let headers = {}
        headers['Content-Type'] = 'application/json'
        headers['Accept'] = 'application/json'
        this.message = `********** \n This message will be sent to ${this.leoEmail} ${this.leoName} after VoteFromAbroad 3.0 is launched. \n\n We have NOT sent in your FPCA. \n ********** \n\n\n\n ${this.message}`
        let body = {subject: this.subject, email: this.formEmail, message: this.message, htmlMessage: this.htmlMessage, leoName: this.leoName, leoEmail: this.leoEmail, image: this.fpca ? this.fpca.toString() : null, reqDoc: this.reqDoc ? this.reqDoc.toString() : null, firstName: this.firstName, lastName: this.lastName}
        console.log(typeof this.fpca)
        axios.post('https://votefromabroad.netlify.com/api/mailer', body, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            console.log(response.data)
            this.isMailing = false
            this.$toast.open({
              message: `Sent! Check your inbox for a copy (${this.formEmail})`,
              type: 'is-success'
            })
            this.$router.push('dashboard')
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
      }
    }
  },
  mounted () {
    this.subject = 'FPCA Submission'
    this.message = `Please find my FPCA form for the 2018 calendar year. Can you confirm receipt and also confirm that I do not need to send in the paper copy? \n\nThank you so much for everything you do. Your work is much appreciated by Americans abroad! \n\n Sincerely, \n\n${this.firstName} ${this.lastName} \n\n${this.formEmail} \n\n${this.tel}`
    this.htmlMessage = `Please find my FPCA form for the 2018 calendar year. Can you confirm receipt and also confirm that I do not need to send in the paper copy? \n\nThank you so much for everything you do. Your work is much appreciated by Americans abroad! <br/><br/> Sincerely, <br/><br/>${this.firstName} ${this.lastName} <br/><br/>${this.formEmail} <br/><br/>${this.tel}`
  }
}
</script>

<style>
.input[disabled] {
  background-color: #fcfcfc;
  color: #111;
}
</style>
