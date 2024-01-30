// import {OAuthRequestError} from '@lucia-auth/oauth'
//
// export default defineEventHandler(async (event) => {
//   const storedState = getCookie(event, 'google_oauth_state')
//   const query = getQuery(event)
//   const state = query.state?.toString()
//   const code = query.code?.toString()
//
//   // validate state
//   if (!storedState || !state || storedState !== state || !code) {
//     return sendError(
//       event,
//       createError({
//         statusCode: 400,
//       }),
//     )
//   }
//   try {
//     const { getExistingUser, googleUser, createUser } = await googleAuth.validateCallback(code)
//     const getUser = async () => {
//       const existingUser = await getExistingUser()
//       if (existingUser)
//         return existingUser
//       return await createUser({
//         attributes: {
//           name: googleUser.name,
//           email: googleUser.email!,
//         },
//       })
//     }
//
//     const user = await getUser()
//     // await authService.createSession(user.userId, event)
//     return sendRedirect(event, '/app') // redirect to profile page
//   }
//   catch (e) {
//     console.error(e)
//     if (e instanceof OAuthRequestError) {
//       // invalid code
//       return sendError(
//         event,
//         createError({
//           statusCode: 400,
//         }),
//       )
//     }
//     return sendError(
//       event,
//       createError({
//         statusCode: 500,
//       }),
//     )
//   }
// })
