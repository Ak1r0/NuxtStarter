export default function (exec: () => any) {
    const { data, pending, error, refresh } = exec();

    if(error.statusCode == 401 || error.statusCode == 403) {
        navigateTo('/login')
    }

    return { data, pending, error, refresh };
}