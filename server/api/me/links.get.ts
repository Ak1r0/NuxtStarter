
export default defineEventHandler(async (event) => {
    const user = authService.getAuthenticatedUser(event)
    if (!user)
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    const links = await userService.getLinks(user)
    return { links }
})
