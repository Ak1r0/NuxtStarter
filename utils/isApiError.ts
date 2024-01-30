import type {H3Error} from "h3";
import type {ZodIssue} from "zod";
import type {FetchError} from "ofetch";

export type ApiError = {
    data: H3Error<ZodIssue[]>,
}

export function isApiError(error: FetchError | any): error is ApiError {

    return (error as FetchError).data !== undefined
        && error.data.statusCode !== undefined
        && (
            (error.data.statusCode === 400 && error.data.data !== undefined)
            || error.data.message !== undefined
        );
}