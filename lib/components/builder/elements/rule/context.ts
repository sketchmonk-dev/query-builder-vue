import { inject, provide, type Ref } from "vue";
import type { QueryField, QueryOperator, Rule, ValueType } from "../../../../common";
import { useQueryBuilder } from "../../context";

export interface RuleContext<TValue = any> {
    rule: Ref<Rule<TValue>>;
    // -- getters & setters
    getField: () => QueryField | undefined;
    setField: (fieldName: string) => void;
    getOperator: () => QueryOperator | undefined;
    setOperator: (operatorName: string) => void;
    getValue: () => ValueType<TValue>;
    setValue: (value: ValueType<TValue>) => void;
}

const QUERY_BUILDER_RULE_INJECTION_KEY = Symbol("QUERY_BUILDER_RULE");

export function useProvideQueryBuilderRule<TValue = any>(rule: Ref<Rule<TValue>>) {
    const qb = useQueryBuilder();

    // -- getters & setters
    const getField = () => {
        return qb.getField(rule.value.field)
    }
    const setField = (fieldName: string) => {
        const updatedRule = { ...rule.value, field: fieldName };
        const field = qb.getField(fieldName);
        if (field) {
            const operators = field.operators;
            if (!operators.some((o) => o.name === rule.value.operator)) {
            updatedRule.operator = field.defaultOperator || operators[0].name;
            }
            if (field.defaultValue) {
            const operator = qb.getOperator(fieldName, updatedRule.operator);
            if (operator) {
                const value = field.defaultValue({ operator });
                if (value !== undefined) {
                updatedRule.value = value;
                }
            }
            }
        }
        rule.value = updatedRule;
    }

    const getOperator = () => {
        return qb.getOperator(rule.value.field, rule.value.operator)
    }
    const setOperator = (operatorName: string) => {
        const updatedRule = { ...rule.value, operator: operatorName };
        const field = qb.getField(rule.value.field);
        if (field) {
            const operator = field.operators.find((o) => o.name === operatorName);
            if (operator && field.defaultValue) {
            const value = field.defaultValue({ operator });
            if (value !== undefined) {
                updatedRule.value = value;
            }
            }
        }
        rule.value = updatedRule;
    }

    const getValue = () => {
        return rule.value.value
    }
    const setValue = (value: ValueType<TValue>) => {
        rule.value = {
            ...rule.value,
            value,
        }
    }

    // -- actions

    const context: RuleContext = {
        rule,
        // -- getters & setters
        getField,
        setField,
        getOperator,
        setOperator,
        getValue,
        setValue,
    };
    // -- 
    provide(QUERY_BUILDER_RULE_INJECTION_KEY, context);
    return context;
}

export function useQueryBuilderRule() {
    const context = inject<RuleContext>(QUERY_BUILDER_RULE_INJECTION_KEY);
    if (!context) {
        throw new Error("useQueryBuilderRule() is called outside QueryBuilderRule.");
    }
    return context;
}