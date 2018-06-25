<template>
<div class="hero-head">
  <div>
    <h1 class="has-text-centered title is-3">Ballot Request Status</h1>
    <h3 class="has-text-centered subtitle is-4">Next Steps...</h3>
  </div>
  <div class="hero-body columns is-centered">
    <div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
      <!-- level menu -->
      <div v-if="isAuthenticated" class="level is-mobile">
        <div class="level-left">
          <span class="level-item">
            <h1 class="subtitle is-3">
              <span class="has-text-grey-light">Hello </span><span><strong>{{ name }}</strong></span>
            </h1>
          </span>
        </div>
        <div class="level-right">
          <div v-if="isAdmin" class="select level-item">
            <select>
              <option>2018</option>
              <option>2016</option>
              <option>2017</option>
              <option selected>2018</option>
              <option>2019</option>
              <option>2020</option>
            </select>
          </div>
          <div class="level-item"  @click="$store.dispatch('userauth/logout')">
            <h1 class="subtitle is-5 has-text-grey">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              Logout
            </h1>
          </div>
        </div>
      </div>

      <!-- main section -->
      <div class="columns">
        <div v-if="isAdmin" class="column is-4-tablet is-3-desktop is-2-widescreen">
          <!-- The sidebar -->
          <nav class="menu">
            <p class="menu-label">
              Menu
            </p>
            <ul class="menu-list">
              <li>
                <a href="dashboard.html">
                  <span class="icon">
                    <i class="fa fa-tachometer-alt"></i>
                  </span>
                  Dashboard
                  </a>
              </li>
              <li>
                <a class="is-active" href="books.html">
                  <span class="icon">
                    <i class="fa fa-book"></i>
                  </span>
                  Books
                </a>
              </li>
              <li>
                <a href="customers.html">
                  <span class="icon">
                    <i class="fa fa-address-book"></i>
                  </span>
                  Customers
                </a>
              </li>
              <li>
                <a href="orders.html">
                  <span class="icon">
                    <i class="fa fa-file-text-o"></i>
                  </span>
                  Orders
                </a>
              </li>
            </ul>
          </nav>
        </div>
          <div class="column">
            <div class="columns">
              <div class="column">
                <!-- <request-stage></request-stage> -->
                <article class="message is-warning">
                  <div @click="$router.push(`/states/${currentRequestObject.leo.s}`)" class="message-body" v-html="md(deadlineLanguage)">
                    <!-- {{deadlineLanguage | markdown}} -->
                  </div>
                </article>
                <article class="message is-success">
                  <div class="message-body">
                    <p>Thank you for using VoteFromAbroad to generate your Voter Registration/Ballot Request form. <strong>Be sure to submit your form</strong> to your Local Election Official before the deadline (see above). We also strongly recommend that you verify with you election official that they have received and processed your form.  You can reach your election official with the following:
                    </p>
                    <div class="box">
                      <p>
                      <span class="title is-5" v-if="currentRequestObject.leo.n"><strong>{{ currentRequestObject.leo.n }}</strong><br/><br/></span>
                      <span v-if="currentRequestObject.leo.a1"><strong>{{ currentRequestObject.leo.a1 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo.a2"><strong>{{ currentRequestObject.leo.a2 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo.a3"><strong>{{ currentRequestObject.leo.a3 }}</strong><br/></span>
                      <span><strong>{{ currentRequestObject.leo.c }}, </strong>
                      <strong>{{ currentRequestObject.leo.s }} </strong>
                      <strong>{{ currentRequestObject.leo.z }}</strong><br/></span>
                      <span class="has-text-right"><strong>United States of America</strong><br/><br/></span></p>
                      <p>
                      <span v-if="currentRequestObject.leo.e">Email: <strong>{{ currentRequestObject.leo.e }}</strong><br/><br/></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo.p">Phone: <strong>+1 {{ currentRequestObject.leo.p }}</strong><br/><br/></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo.f">Fax: <strong>+1 {{ currentRequestObject.leo.f }}</strong><br/></span>
                      </p>
                    </div>
                    <p>
                      If you need any help, contact our volunteer voter support team at: help@votefromabroad.org.
                      Thanks for voting!
                    </p>
                  </div>
                </article>
              </div>
            </div>

          <!-- stats and buttons -->
          <div class="columns is-multiline is-centered">
            <div class="column">
              <nuxt-link to="/FAQs">
                <div class="notification is-info has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-graduation-cap"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">Learn</p>
                      <p class="subtitle is-6">about your rights as a voter abroad</p>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </div>

            <div class="column">
              <a @click="share">
                <div class="notification is-danger has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-share"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">Share</p>
                      <p class="subtitle is-6">Ask your friends to vote from abroad</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UserDashboard from '~/components/UserDashboard'
// import VueMarkdown from 'vue-markdown'
import RequestStage from '~/components/RequestStage'
import snarkdown from 'snarkdown'

// Utility Functions for filtering rules

// Filter Function to remove elections from other states
function filterToMatchVotingState (election) {
  return election.state && election.state.toLowerCase() === this.state.toLowerCase()
}
// Filter function to remove rules that don't apply to this voterClass
function filterToMatchVoterType (rule) {
  if (!(typeof rule.voterType === 'string') || !this.voterType) {
    return true
  } else if (this.voterType === 'military' || this.voterType === 'milSpouse' || this.voterType === 'natGuard') {
    return !rule.voterType.includes('Citizen')
  } else {
    return !rule.voterType.includes('Uniformed')
  }
}

function filterRuleToMatchSubmissionMethod (rule) {
  if (!(/Mail|Email|Fax/.test(rule.rule)) || !this.submissionMethod) {
    return true
  } else if (this.submissionMethod.toLowerCase() === 'email') {
    return /Email/.test(rule.rule)
  } else if (this.submissionMethod.toLowerCase() === 'mail') {
    return /Mail/.test(rule.rule)
  } else if (this.submissionMethod.toLowerCase() === 'fax') {
    return /Fax/.test(rule.rule)
  }
}

// Compare function to sort elections chronolically
function compareElectionDateToSort (a, b) {
  return new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1
}

// Filter function accepting election && voterType && voterRegistrationStatus returning true if election rules match voterType and voterRegistrationStatus
function filterForVoterTypeAndRegistrationStatus (election, i, arr) {
  if (this.voterRegistrationStatus && this.voterRegistrationStatus.toLowerCase() === 'registered') {
    return [...Object.assign({}, election).rules['Ballot Request']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  } else if (this.voterRegistrationStatus && this.voterRegistrationStatus.toLowerCase() === 'notregistered') {
    return [...election.rules['Registration']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  } else {
    return [...Object.assign({}, election).rules['Registration'], ...Object.assign({}, election).rules['Ballot Request']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  }
}
function removeRulesForOtherRegistrationStatus (election) {
  let thisElection = Object.assign({}, election)
  let rules = {}
  if (this.voterRegistrationStatus && /notregistered/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Registration'] = thisElection.rules['Registration']
  } else if (this.voterRegistrationStatus && /registered/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Ballot Request'] = thisElection.rules['Ballot Request']
  }
  if (!this.voterRegistrationStatus || /unsure/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Ballot Request'] = thisElection.rules['Ballot Request']
    rules['Registration'] = thisElection.rules['Registration']
  }
  thisElection.rules = rules
  return thisElection
}

// function accepting array of elections, voterRegistrationStatus, voterType, state, submissionMethod and returning a the next election where rules apply to voter
function getNextEligibleRules (electionArr, state, voterRegistrationStatus, voterType, submissionMethod) {
  return [ ...electionArr ] // work with a copy of array so we are not mutating original array
    .filter(filterToMatchVotingState, {state}) // remove elections from other states
    .filter(filterForVoterTypeAndRegistrationStatus, {voterType, voterRegistrationStatus, submissionMethod}) // remove elections with rules that for different voter type/registration status/ or past due
    .map(removeRulesForOtherRegistrationStatus, {voterRegistrationStatus})
    .sort(compareElectionDateToSort)
}

function getRuleLanguage (eligibleRules, type, voterRegistrationStatus) {
  if (!eligibleRules || !type || !eligibleRules.rules || !eligibleRules.rules[type] || eligibleRules.rules[type].length === 0) {
    return `There is no deadline for ${type.toLowerCase()}.`
  } else if (eligibleRules && type && eligibleRules.rules[type] && eligibleRules.rules[type].length === 1) {
    return `Your form must be ${getRuleType(eligibleRules.rules[type][0].rule)} ${getRuleDeadline(eligibleRules.rules[type][0].date)}.`
  } else {
    return eligibleRules.rules[type].map((rule, i) => `If you send your form by ${getRuleSubmissionOption(eligibleRules.rules[type][i].rule)}, it must be ${getRuleType(eligibleRules.rules[type][i].rule)} ${getRuleDeadline(eligibleRules.rules[type][i].date)}.`).join(voterRegistrationStatus && /registered/.test(voterRegistrationStatus.toLowerCase()) ? '\n- ' : ' - ')
  }
}

function getRuleType (rule) {
  if (rule && typeof rule === 'string') {
    let rt = ['postmarked by', 'received by', 'sent by', 'no deadline', 'not required', 'signed by', 'signed/postmarked by'].filter(x => rule.toLowerCase().includes(x))
    return rt.includes('signed/postmarked by') ? 'signed/postmarked by' : rt[0]
  } else return 'received by'
}
function getRuleDeadline (date) {
  return date && typeof date === 'string' && date.substr(0, 4) === new Date().getFullYear().toString() ? `${new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} at ${new Date(date).toLocaleTimeString('en-US', {hour: 'numeric'}).toUpperCase()}` : null
}
function getRuleSubmissionOption (rule) {
  let st = []
  if (/Email/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('email')
  if (/Fax/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('fax')
  if (/Mail/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('postal mail')
  return st.length === 3 ? `${st[0]}, ${st[1]} or ${st[2]}` : st.length === 2 ? `${st[0]} or ${st[1]}` : st[0]
}

function getDeadlineLanguage (electionArr, state, voterRegistrationStatus, voterType, submissionMethod) {
  let applicableRules = getNextEligibleRules([...electionArr], state || '', voterRegistrationStatus, voterType, submissionMethod)
  // console.log(applicableRules)
  applicableRules = applicableRules[0]
  if (!applicableRules) {
    return `IMPORTANT: Your form must be received by your state deadline to be eligible to vote in the November 6 General Election.  \nYou can find your state deadlines at www.votefromabroad.org/states `
  } else {
    switch (voterRegistrationStatus) {
      case 'notRegistered':
        return `** IMPORTANT DEADLINES for new voters to vote in the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} **\n- ${getRuleLanguage(applicableRules, 'Registration', voterRegistrationStatus)}\nSee all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
      case 'registered':
        return `** IMPORTANT DEADLINES for registered voters to vote in the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} **\n- ${getRuleLanguage(applicableRules, 'Ballot Request', voterRegistrationStatus)}\nSee all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
      default:
        return `** IMPORTANT DEADLINES ** for the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} -- NEW VOTERS - ${getRuleLanguage(applicableRules, 'Registration', voterRegistrationStatus)} REGISTERED VOTERS - ${getRuleLanguage(applicableRules, 'Ballot Request', voterRegistrationStatus)} - See all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
    }
  }
}

export default {
  name: 'User-Account',
  components: {
    UserDashboard,
    // VueMarkdown,
    RequestStage
  },
  async asyncData ({app, store}) {
    let state = store.getters['requests/getCurrent'].leo.s || ''
    let elections = (await app.$content('/elections').get('elections')).body
    let voterRegistrationStatus = store.getters['requests/getCurrent'].isRegistered
    let voterType = store.getters['requests/getCurrent'].voterClass
    return {
      registering: store.getters['requests/getCurrent'].isRegistered !== 'registered',
      state: store.getters['requests/getCurrent'].leo.s,
      submissionMethod: store.getters['requests/getCurrent'].recBallot,
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll(),
      stateElections: (await app.$content('/elections').get('elections')).body
        .filter(election => election.state && state && election.state.toLowerCase() === state.toLowerCase())
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        }),
      elections: elections,
      deadlineLanguage: getDeadlineLanguage(elections, state, voterRegistrationStatus, voterType, null)
    }
  },
  data () {
    return {
      isAdmin: false,
      currentRequestStage: 'Fill & Sign',
      requestStages: [
        {
          title: 'Fill & Sign',
          icon: 'edit',
          content: 'You must completely fill out your ballot request, sign and date it before sending it in.',
          actionText: 'Edit my form',
          faqs: ['What state can I vote in?', 'Do I have to do this every year?']
        },
        {
          title: 'Send in Request',
          icon: 'paper-plane',
          content: 'You must submit your request to your local election official in your town, county or state.  blah blah blah',
          actionText: 'Send Request electronically',
          faqs: []
        },
        {
          title: 'Receive Ballot',
          icon: 'inbox',
          content: 'States must send out ballots at least 45 days prior to an election.  We recomend confirming with your local election official that they have accepted your request.',
          actionText: 'Email my election official'
        },
        {
          title: 'Vote',
          icon: 'check',
          content: 'Be sure to send in your voted ballot by the deadline of.... ',
          actionText: 'Check my deadlines',
          completeText: 'I\'ve already voted'
        }
      ]
    }
  },
  computed: {
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    currentRequest () { return this.$store.state.requests.currentRequest },
    currentRequestObject () { return this.$store.getters['requests/getCurrent'] },
    stage () { return this.currentRequestObject && this.currentRequestObject.status ? this.currentRequestObject.status : 'start' },
    states () { return new Set(this.requests.map(x => x.votAdr.stateISO)) },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : '' },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] },
    leoAdr () {
      let leo = this.currentRequest.leo
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${leo.s ? leo.s + ' ' : ''}${leo.z ? leo.z + '\n' : '\n'}United States of America`
    },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e ? this.currentRequest.leo.e : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n ? this.currentRequest.leo.n : ''
    },
    leoFax () {
      return this.currentRequest.leo && this.currentRequest.leo.f ? '+1 ' + this.currentRequest.leo.f : ''
    },
    leoPhone () {
      return this.currentRequest.leo && this.currentRequest.leo.p ? '+1 ' + this.currentRequest.leo.p : ''
    }
    // currentRequestStage () { return this.currentRequest && this.currentRequest.stage ? this.currentRequest.stage : 'fill' }
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  },
  methods: {
    md (md) { return snarkdown(md) },
    share () {
      this.$dialog.alert({
        title: 'Tell a friend about VoteFromAbroad',
        message: 'To be added after launch',
        confirmText: 'OK',
        type: 'is-danger',
        hasIcon: true,
        icon: 'share',
        iconPack: 'fas'
      })
    }
  }
}
</script>

<style>

</style>
