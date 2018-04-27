export default function ({ route, params, store, redirect }) {
  let current = store.getters['requests/getCurrent']
  // console.log(params)
  // console.log(route.name)
  if ((params.stage === 'voting-information' ||
  params.stage === 'id-and-contact-information' ||
  route.name.indexOf('review') > -1 ||
  route.name.indexOf('sign-and-submit') > -1 ||
  route.name.indexOf('complete') > -1) &&
    (!current ||
    !current.firstName ||
    !current.lastName ||
    !current.abrAdr.alt1)
  ) {
    return redirect('/request/your-information')
  } else if ((params.stage === 'id-and-contact-information' ||
  route.name.indexOf('review') > -1 ||
  route.name.indexOf('sign-and-submit') > -1 ||
  route.name.indexOf('complete') > -1) &&
    (!current.votAdr ||
    !current.votAdr.thoroughfare ||
    !current.votAdr.locality ||
    !current.votAdr.stateISO ||
    !current.votAdr.postalcode ||
    // !current.leo ||
    !current.leo.a1 ||
    !current.voterClass ||
    !current.recBallot)
  ) {
    return redirect('/request/voting-information')
  } else if (
    (route.name.indexOf('review') > -1 ||
    route.name.indexOf('sign-and-submit') > -1 ||
    route.name.indexOf('complete') > -1) &&
    (!current.identification)
  ) {
    return redirect('/request/id-and-contact-information')
  }
}
