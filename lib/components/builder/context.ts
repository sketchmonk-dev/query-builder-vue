import { inject, provide, type Ref } from "vue";
import type { Query, QueryBuilderConfig, QueryField, QueryOperator } from "../../common";

export interface QueryBuilderState {
    config: Ref<QueryBuilderConfig>;
    query: Ref<Query>;
    disabled: Ref<boolean>;
}

export interface QueryBuilderContext extends QueryBuilderState {
    // -- getters
    getField: (name: string) => QueryField | undefined;
    getOperator: (fieldName: string, operatorName: string) => QueryOperator | undefined;
}

const QUERY_BUILDER_INJECTION_KEY = Symbol("QUERY_BUILDER");

export function useProvideQueryBuilder(state: QueryBuilderState) {

    const { config, query, disabled } = state;

    const getField = (name: string): QueryField | undefined => {
        const field = config.value.fields.find((f) => f.name === name);
        return field;
    }
    const getOperator = (fieldName: string, operatorName: string): QueryOperator | undefined => {
        const field = getField(fieldName);
        if (!field) {
            return undefined;
        }
        const operator = field.operators.find((o) => o.name === operatorName);
        return operator;
    }

    const context: QueryBuilderContext = {
        config,
        query,
        disabled,
        getField,
        getOperator,
    };
    provide(QUERY_BUILDER_INJECTION_KEY, context);
    return context;
}

export function useQueryBuilder() {
    const context = inject<QueryBuilderContext>(QUERY_BUILDER_INJECTION_KEY);
    if (!context) {
        throw new Error("useQueryBuilder() is called without provider.");
    }
    return context;
}