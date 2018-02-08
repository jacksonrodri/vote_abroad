<template>
  <div>
    <b-field>
      {{ $t('request.addressAbroadInstructions')}}
      <b-input type="text" v-model="alt1" @input="updateAddress()"></b-input>
    </b-field>
    <b-field>
      <b-input type="text" v-model="alt2" @input="updateAddress()"></b-input>
    </b-field>
    <b-field>
      <b-input type="text" v-model="alt3" @input="updateAddress()"></b-input>
    </b-field>
    <b-field>
      <b-input type="text" v-model="alt4" @input="updateAddress()"></b-input>
    </b-field>
    <b-field>
      <b-input type="text" v-model="alt5" @input="updateAddress()"></b-input>
    </b-field>
  </div>
</template>
