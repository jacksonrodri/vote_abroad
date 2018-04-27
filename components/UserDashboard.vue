<template>
  <div>
    <b-tabs position="is-centered" size="is-small" type="is-toggle" class="block">
      <b-tab-item label="Account" icon="user"></b-tab-item>
      <b-tab-item label="Ballot Requests" icon="check">
        <b-table
          :data="requests"
          :opened-detailed="openedDetails"
          detailed
          detail-key="id"
          @details-open="(row, index) => $toast.open(`Expanded ${row.firstName} ${row.lastName}`)">

          <template slot-scope="props">
            <b-table-column label="First Name">
              {{ props.row.firstName }}
            </b-table-column>

            <b-table-column label="Last Name">
              {{ props.row.lastName }}
            </b-table-column>

            <b-table-column label="Birth Date" centered>
              {{ new Date(props.row.dob).toLocaleDateString() }}
            </b-table-column>

            <b-table-column label="State">
              {{ props.row.votAdr.administrativearea }}
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <article class="media">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img src="static/img/placeholder-128x128.png">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ props.row.firstName }} {{ props.row.lastName }}</strong>
                    <small>@{{ props.row.firstName }}</small>
                    <small>31m</small>
                    <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin ornare magna eros, eu pellentesque tortor vestibulum ut.
                    Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                  </p>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </b-tab-item>
      <b-tab-item label="Elections" icon="check">
        <b-table
          :data="requests"
          :opened-detailed="openedDetails"
          detailed
          detail-key="id"
          @details-open="(row, index) => $toast.open(`Expanded ${row.firstName} ${row.lastName}`)">

          <template slot-scope="props">
            <b-table-column label="First Name">
              {{ props.row.firstName }}
            </b-table-column>

            <b-table-column label="Last Name">
              {{ props.row.lastName }}
            </b-table-column>

            <b-table-column label="Birth Date" centered>
              {{ new Date(props.row.dob).toLocaleDateString() }}
            </b-table-column>

            <b-table-column label="State">
              {{ props.row.votAdr.administrativearea }}
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <article class="media">
              <figure class="media-left">
                <p class="image is-64x64">
                  <img src="static/img/placeholder-128x128.png">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ props.row.firstName }} {{ props.row.lastName }}</strong>
                    <small>@{{ props.row.firstName }}</small>
                    <small>31m</small>
                    <br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin ornare magna eros, eu pellentesque tortor vestibulum ut.
                    Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                  </p>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: 'User-Dashboard',
  data () {
    return {
      data: [],
      openedDetails: [],
      id: ''
    }
  },
  computed: {
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    currentRequest () { return this.$store.state.requests.currentRequest },
    states () { return new Set(this.requests.map(x => x.votAdr.stateISO)) }
  }
}
</script>
