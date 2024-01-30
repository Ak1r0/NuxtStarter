import type {ZodIssue} from "zod";
import type {FormError, } from "#ui/types";
import type {Form} from "#ui/types/form";
import type {ApiError} from "~/utils/isApiError";
import {boolean} from "drizzle-orm/pg-core";
/**
 * Map validation errors to { path: string, message: string }
 */
export function useFormErrorMapper(form: globalThis.Ref<Form<unknown>>, error: ApiError): boolean {

    if (error.data.statusCode === 400) {
        const errors = error.data.data?.flatMap((e: ZodIssue) => {
            return e.path.map(path => {
                return {path: `${path}`, message: e.message}
            });
        })

        form.value.setErrors(errors || []);
        return true;
    }

    return false
}