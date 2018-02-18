<template>
  <div class="my-canvas-wrapper">
    <canvas class="fpca target" ref="my-canvas"></canvas>
    <!-- <div></div> -->
    <!-- <div @mouseover="canvasClick" id="section0"></div> -->
    <div v-show="sectionEditor !== 1 && sectionEditor" id="section1"></div>
    <div v-show="sectionEditor !== 2 && sectionEditor" id="section2"></div>
    <div v-show="sectionEditor !== 3 && sectionEditor" id="section3"></div>
    <div v-show="sectionEditor !== 4 && sectionEditor" id="section4"></div>
    <div v-show="sectionEditor !== 5 && sectionEditor" id="section5"></div>
    <div v-show="sectionEditor !== 6 && sectionEditor" id="section6"></div>
    <div v-show="sectionEditor !== 7 && sectionEditor" id="section7"></div>
    <!-- <div @mouseover="canvasClick" id="section8"></div> -->
    <div @click="openSection" :style="[editButton]"><b-icon :style="iconStyle" icon="edit" custom-size="fa-5x" type="is-danger"></b-icon></div>
    <slot></slot>
    <b-modal :active.sync="isEditModalActive" has-modal-card>
      <component v-bind:is="currentModal">
        <!-- component changes when vm.currentView changes! -->
      </component>
    </b-modal>
  </div>
</template>

<script>
import Section1 from '~/components/Section1.vue'
import Section2 from '~/components/Section2.vue'
import Section3 from '~/components/Section3.vue'
import Section4 from '~/components/Section4.vue'
import Section5 from '~/components/Section5.vue'
import Section6 from '~/components/Section6.vue'

export default {
  components: {
    Section1,
    Section2,
    Section3,
    Section4,
    Section5,
    Section6
  },
  data () {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        context: null
      },
      sectionEditor: null,
      currentModal: '',
      isEditModalActive: false,
      sections: [
        {
          id: 1,
          start: 18,
          end: 22.2
        },
        {
          id: 2,
          start: 40.2,
          end: 12.5
        },
        {
          id: 3,
          start: 52.7,
          end: 17.3
        },
        {
          id: 4,
          start: 70,
          end: 10
        },
        {
          id: 5,
          start: 80,
          end: 7.5
        },
        {
          id: 6,
          start: 87.5,
          end: 14.6
        },
        {
          id: 7,
          start: 102.1,
          end: 21.7
        }
      ]
    }
  },

  computed: {
    canvasRect () {
      return this.$refs['my-canvas'].getBoundingClientRect()
    },
    editButton () {
      return {
        'margin-top': `${this.sectionEditor ? this.sections[this.sectionEditor - 1].start : 0}%`,
        'padding-bottom': `${this.sectionEditor ? this.sections[this.sectionEditor - 1].end / 2 : 0}%`,
        position: 'absolute',
        width: '100%',
        cursor: 'pointer',
        display: this.sectionEditor ? 'flex' : 'none',
        'align-items': 'center',
        'justify-content': 'center',
        border: '2px dotted red'
      }
    },
    iconStyle () {
      return {
        'padding-top': `${this.sectionEditor ? this.sections[this.sectionEditor - 1].end / 2 : 0}%`
      }
    }
  },

  created: function () {
    if (process.browser) {
      window.addEventListener('mousemove', this.move)
    }
  },
  destroyed: function () {
    window.removeEventListener('mousemove', this.move)
  },

  // Allows any child component to `inject: ['provider']` and have access to it.
  provide () {
    return {
      provider: this.provider
    }
  },

  methods: {
    move: function (val) {
      // console.log(this.provider.context)
      let cRect = this.$refs['my-canvas'].getBoundingClientRect()
      if (val.clientX - cRect.left > -1 &&
        cRect.right - val.clientX > -1 &&
        val.clientY - cRect.top > -1 &&
        cRect.bottom - val.clientY > -1) {
        // console.log({ x: val.clientX - cRect.left, y: val.clientY - cRect.top })
        let y = (100 * (val.clientY - cRect.top) / cRect.height * (cRect.height / cRect.width))
        // let y = (val.clientY - cRect.top)
        console.log(val.clientY - cRect.top)
        this.sections.forEach((section) => {
          if (section.start < y && y < (section.start + section.end)) {
            this.sectionEditor = section.id
            // console.log('true', section.id, y, section.start, section.start + section.end)
          }
        })
      } else { this.sectionEditor = null }
    },
    canvasClick: function (val) {
      console.log(val)
    },
    openSection: function (val) {
      this.currentModal = `section-${this.sectionEditor}`
      this.isEditModalActive = true
    }
  },

  mounted () {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.provider.context = this.$refs['my-canvas'].getContext('2d')

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    // this.$refs['my-canvas'].width = this.$refs['my-canvas'].parentElement.clientWidth
    // this.$refs['my-canvas'].height = this.$refs['my-canvas'].parentElement.clientHeight
    this.$refs['my-canvas'].width = 2550
    this.$refs['my-canvas'].height = 3300
  }
}
</script>

<style>
.my-canvas-wrapper {
  height: 0;
  padding-bottom: 129.4%;
  position: relative
}

.fpca {
  position: absolute;
  top: 0;
  left: 0;
}
#section1 {
  margin-top:18%;
  padding-bottom: 22.2%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section2 {
  margin-top: 40.2%;
  padding-bottom: 12.5%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section3 {
  margin-top: 52.7%;
  padding-bottom: 17.3%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section4 {
  margin-top: 70%;
  padding-bottom: 10%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section5 {
  margin-top: 80%;
  padding-bottom: 7.5%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section6 {
  margin-top: 87.5%;
  padding-bottom: 14.6%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

#section7 {
  margin-top: 102.1%;
  padding-bottom: 21.7%;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

canvas {
  width: 100%
}

</style>
