<script>
const { DateTime } = require('luxon')
// Note how there's no template or styles in this component.

// Helper functions to convert a percentage of canvas area to pixels.
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)
const percentHeightToPix = (percent, ctx) => Math.floor((ctx.canvas.height / 130) * percent)

export default {
  // Gets us the provider property from the parent <my-canvas> component.
  inject: ['provider'],

  props: {
    // Start coordinates (percentage of canvas dimensions).
    x1: {
      type: Number,
      default: 0
    },
    y1: {
      type: Number,
      default: 0
    },

    // End coordinates (percentage of canvas dimensions).
    x2: {
      type: Number,
      default: 0
    },
    y2: {
      type: Number,
      default: 0
    },

    // The value to display.
    value: {
      type: Number,
      defualt: 0
    },

    // The color of the box.
    color: {
      type: String,
      default: '#F00'
    },
    lastName: {
      type: String,
      default: ''
    },
    firstName: {
      type: String,
      default: ''
    },
    middleName: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    previousName: {
      type: String,
      default: ''
    },
    dob: {
      type: Date,
      default: null
    },
    ssn: {
      type: String,
      default: ''
    },
    stateId: {
      type: String,
      default: ''
    },
    votStreet: {
      type: String,
      default: ''
    },
    votApt: {
      type: String,
      default: ''
    },
    votCity: {
      type: String,
      default: ''
    },
    votState: {
      type: String,
      default: ''
    },
    votCounty: {
      type: String,
      default: ''
    },
    votZip: {
      type: String,
      default: ''
    },
    abrAdr: {
      type: String,
      default: ''
    },
    fwdAdr: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    altEmail: {
      type: String,
      default: ''
    },
    tel: {
      type: String,
      default: ''
    },
    fax: {
      type: String,
      default: ''
    },
    party: {
      type: String,
      default: ''
    },
    addlInfo: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: new Date()
    },
    classification: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      default: ''
    },
    recBallot: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      // We cache the dimensions of the previous
      // render so that we can clear the area later.
      oldBox: {
        x: null,
        y: null,
        w: null,
        h: null
      }
    }
  },

  computed: {
    birthMon () {
      DateTime.fromISO(this.dob).toString().substr(5, 2)
    },
    birthDay () {
      DateTime.fromISO(this.dob).toString().substr(8, 2)
    },
    birthYr () {
      DateTime.fromISO(this.dob).toString().substr(0, 4)
    },
    isMale () {
      return this.sex.toLowerCase() === 'male' ? 'x' : ''
    },
    isFemale () {
      return this.sex.toLowerCase() === 'female' ? 'x' : ''
    },
    isMilitary () {
      return this.classification.toLowerCase() === 'military' ? 'x' : ''
    },
    isMilSpouse () {
      return this.classification.toLowerCase() === 'milspouse' ? 'x' : ''
    },
    isNatGuard () {
      return this.classification.toLowerCase() === 'natguard' ? 'x' : ''
    },
    isIntendToReturn () {
      return this.classification.toLowerCase() === 'intendtoreturn' ? 'x' : ''
    },
    isUncertainReturn () {
      return this.classification.toLowerCase() === 'uncertainReturn' ? 'x' : ''
    },
    isNeverResided () {
      return this.classification.toLowerCase() === 'neverResided' ? 'x' : ''
    },
    isRecieveBallotMail () {
      return this.recBallot.toLowerCase() === 'mail' ? 'x' : ''
    },
    isReceiveBallotEmail () {
      return this.recBallot.toLowerCase() === 'email' ? 'x' : ''
    },
    isReceiveBallotFax () {
      return this.recBallot.toLowerCase() === 'fax' ? 'x' : ''
    },
    calculatedBox () {
      const ctx = this.provider.context

      // Turn start / end percentages into x, y, width, height in pixels.
      const calculated = {
        x: percentWidthToPix(this.x1, ctx),
        y: percentHeightToPix(this.y1, ctx),
        w: percentWidthToPix(this.x2 - this.x1, ctx),
        h: percentHeightToPix(this.y2 - this.y1, ctx)
      }

      // Yes yes, side-effects. This lets us cache the box dimensions of the previous render.
      // before we re-calculate calculatedBox the next render.
      this.oldBox = calculated
      return calculated
    },
    calculated () {
      const ctx = this.provider.context
      return {
        fontSize: Math.floor(ctx.canvas.width / 64) + 'px  serif',
        lastName: {
          x: percentWidthToPix(17.8, ctx),
          y: percentHeightToPix(25.3, ctx)
        },
        firstName: {
          x: percentWidthToPix(17.8, ctx),
          y: percentWidthToPix(27.3, ctx)
        },
        middleName: {
          x: percentWidthToPix(17.8, ctx),
          y: percentWidthToPix(29.3, ctx)
        },
        suffix: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        previousName: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(27.3, ctx)
        },
        birthMon: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        birthDay: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        birthYr: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        ssn: [
          {x: percentWidthToPix(18.8, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(21.1, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(23.4, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(26.7, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(29.0, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(32.0, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(34.3, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(36.7, ctx), y: percentWidthToPix(31.6, ctx)},
          {x: percentWidthToPix(39.0, ctx), y: percentWidthToPix(31.6, ctx)}
        ],
        stateId: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(31.6, ctx)
        },
        votStreet: {
          x: percentWidthToPix(17.8, ctx),
          y: percentWidthToPix(37.5, ctx)
        },
        votApt: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(37.5, ctx)
        },
        votCity: {
          x: percentWidthToPix(17.8, ctx),
          y: percentWidthToPix(39.6, ctx)
        },
        votState: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(39.6, ctx)
        },
        votCounty: {
          x: percentWidthToPix(17.8, ctx),
          y: percentWidthToPix(41.7, ctx)
        },
        votZip: {
          x: percentWidthToPix(56.5, ctx),
          y: percentWidthToPix(41.7, ctx)
        },
        abrAdr: {
          x: percentWidthToPix(5.1, ctx),
          y: percentWidthToPix(47.6, ctx)
        },
        fwdAdr: {
          x: percentWidthToPix(40.8, ctx),
          y: percentWidthToPix(47.6, ctx)
        },
        email: {
          x: percentWidthToPix(13.8, ctx),
          y: percentWidthToPix(61.3, ctx)
        },
        altEmail: {
          x: percentWidthToPix(13.8, ctx),
          y: percentWidthToPix(63.4, ctx)
        },
        tel: {
          x: percentWidthToPix(45, ctx),
          y: percentWidthToPix(61.3, ctx)
        },
        fax: {
          x: percentWidthToPix(45, ctx),
          y: percentWidthToPix(63.4, ctx)
        },
        party: {
          x: percentWidthToPix(55, ctx),
          y: percentWidthToPix(69.3, ctx)
        },
        addlInfo: {
          x: percentWidthToPix(5.1, ctx),
          y: percentWidthToPix(76.5, ctx)
        },
        date: {
          x: percentWidthToPix(62.3, ctx),
          y: percentWidthToPix(95.3, ctx)
        },
        classification: {
          x: percentWidthToPix(60.3, ctx),
          y: percentWidthToPix(90.3, ctx)
        },
        isMale: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        isFemale: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        isRecieveBallotMail: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        isRecieveBallotEmail: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        },
        isRecieveBallotFax: {
          x: percentWidthToPix(23.3, ctx),
          y: percentWidthToPix(25.3, ctx)
        }
      }
    }
  },

  render () {
    // Since the parent canvas has to mount first, it's *possible* that the context may not be
    // injected by the time this render function runs the first time.
    if (!this.provider.context) return
    const ctx = this.provider.context

    // Keep a reference to the box used in the previous render call.
    // const oldBox = this.oldBox
    // Calculate the new box. (Computed properties update on-demand.)
    // const newBox = this.calculatedBox

    ctx.beginPath()
    // // Clear the old area from the previous render.
    // ctx.clearRect(oldBox.x, oldBox.y, oldBox.w, oldBox.h)
    // // Clear the area for the text.
    // ctx.clearRect(newBox.x, newBox.y - 42, newBox.w, 100)
    ctx.clearRect(0, 0, Math.floor(ctx.canvas.width), Math.floor(ctx.canvas.height))

    let drawing = new Image()
    drawing.src = '/fpca.png'
    drawing.onload = function () {
      ctx.drawImage(drawing, 0, 0, Math.floor(ctx.canvas.width) * 0.8, Math.floor(ctx.canvas.width) * 1.2941 * 0.8)
    }

    // // Draw the new rectangle.
    // ctx.rect(0, 0, Math.floor(ctx.canvas.width), Math.floor(ctx.canvas.height))
    // ctx.fillStyle = '#fafafa'
    // ctx.fill()

    // // Draw the text
    // ctx.fillStyle = '#000'
    // ctx.font = '28px sans-serif'
    // ctx.textAlign = 'center'
    // ctx.fillText(Math.floor(this.value), (newBox.x + (newBox.w / 2)), newBox.y - 14)
    ctx.fillStyle = '#000'
    ctx.font = this.calculated.fontSize
    ctx.textAlign = 'center'
    ctx.fillText(this.ssn[this.ssn.length - 9] || '', this.calculated.ssn[0].x, this.calculated.ssn[0].y)
    ctx.fillText(this.ssn[this.ssn.length - 8] || '', this.calculated.ssn[1].x, this.calculated.ssn[1].y)
    ctx.fillText(this.ssn[this.ssn.length - 7] || '', this.calculated.ssn[2].x, this.calculated.ssn[2].y)
    ctx.fillText(this.ssn[this.ssn.length - 6] || '', this.calculated.ssn[3].x, this.calculated.ssn[3].y)
    ctx.fillText(this.ssn[this.ssn.length - 5] || '', this.calculated.ssn[4].x, this.calculated.ssn[4].y)
    ctx.fillText(this.ssn[this.ssn.length - 4] || '', this.calculated.ssn[5].x, this.calculated.ssn[5].y)
    ctx.fillText(this.ssn[this.ssn.length - 3] || '', this.calculated.ssn[6].x, this.calculated.ssn[6].y)
    ctx.fillText(this.ssn[this.ssn.length - 2] || '', this.calculated.ssn[7].x, this.calculated.ssn[7].y)
    ctx.fillText(this.ssn[this.ssn.length - 1] || '', this.calculated.ssn[8].x, this.calculated.ssn[8].y)
    ctx.textAlign = 'left'
    ctx.fillText(this.lastName, this.calculated.lastName.x, this.calculated.lastName.y)
    ctx.fillText(this.firstName, this.calculated.firstName.x, this.calculated.firstName.y)
    ctx.fillText(this.middleName, this.calculated.middleName.x, this.calculated.middleName.y)
    ctx.fillText(this.suffix, this.calculated.suffix.x, this.calculated.suffix.y)
    ctx.fillText(this.previousName, this.calculated.previousName.x, this.calculated.previousName.y)
    ctx.fillText(this.birthMon, this.calculated.birthMon.x, this.calculated.birthMon.y)
    ctx.fillText(this.birthDay, this.calculated.birthDay.x, this.calculated.birthDay.y)
    ctx.fillText(this.birthYr, this.calculated.birthYr.x, this.calculated.birthYr.y)
    ctx.fillText(this.stateId, this.calculated.stateId.x, this.calculated.stateId.y)
    ctx.fillText(this.votStreet, this.calculated.votStreet.x, this.calculated.votStreet.y)
    ctx.fillText(this.votApt, this.calculated.votApt.x, this.calculated.votApt.y)
    ctx.fillText(this.votCity, this.calculated.votCity.x, this.calculated.votCity.y)
    ctx.fillText(this.votState, this.calculated.votState.x, this.calculated.votState.y)
    ctx.fillText(this.votCounty, this.calculated.votCounty.x, this.calculated.votCounty.y)
    ctx.fillText(this.votZip, this.calculated.votZip.x, this.calculated.votZip.y)
    ctx.fillText(this.abrAdr, this.calculated.abrAdr.x, this.calculated.abrAdr.y)
    ctx.fillText(this.fwdAdr, this.calculated.fwdAdr.x, this.calculated.fwdAdr.y)
    ctx.fillText(this.email, this.calculated.email.x, this.calculated.email.y)
    ctx.fillText(this.altEmail, this.calculated.altEmail.x, this.calculated.altEmail.y)
    ctx.fillText(this.tel, this.calculated.tel.x, this.calculated.tel.y)
    ctx.fillText(this.fax, this.calculated.fax.x, this.calculated.fax.y)
    ctx.fillText(this.party, this.calculated.party.x, this.calculated.party.y)
    ctx.fillText(this.addlInfo, this.calculated.addlInfo.x, this.calculated.addlInfo.y)
    ctx.fillText(this.date, this.calculated.date.x, this.calculated.date.y)
    ctx.fillText(this.classification, this.calculated.classification.x, this.calculated.classification.y)
    ctx.fillText(this.isMale, this.calculated.isMale.x, this.calculated.isMale.y)
    ctx.fillText(this.isFemale, this.calculated.isFemale.x, this.calculated.isFemale.y)
    ctx.fillText(this.isRecieveBallotMail, this.calculated.isRecieveBallotMail.x, this.calculated.isRecieveBallotMail.y)
    ctx.fillText(this.isRecieveBallotEmail, this.calculated.isRecieveBallotEmail.x, this.calculated.isRecieveBallotEmail.y)
    ctx.fillText(this.isRecieveBallotFax, this.calculated.isRecieveBallotFax.x, this.calculated.isRecieveBallotFax.y)
  }
}
</script>
