// import { Auth } from 'aws-amplify'
import Amplify, { Auth } from 'aws-amplify'
import AWSExports from '../aws-exports'
export default async () => {
  Amplify.configure(AWSExports)
  const user = await Auth.currentUserInfo()
  console.log('coguser', user)
  // Auth.configure(AWSExports)
  // const ListEvents = `query ListEvents {
  //   listEvents {
  //     items {
  //       id
  //       where
  //       description
  //     }
  //   }
  // }`
  // const GetEvent = `query GetEvent($id: ID! $nextToken: String) {
  //   getEvent(id: $id) {
  //     id
  //     name
  //     description
  //     comments(nextToken: $nextToken) {
  //       items {
  //         content
  //       }
  //     }
  //   }
  // }`
  // window.onNuxtReady(async (app) => {
  //   const allEvents = await API.graphql({ ListEvents })
  //   // const oneEvent = await API.graphql(graphqlOperation(GetEvent, { id: 'some id' }))
  //   // console.log('oneEvent', oneEvent)
  //   console.log('allEvents', allEvents)
  // })
}
