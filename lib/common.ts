export type RuleCombinator = 'and' | 'or';
export type RangeType<T> = { from: T; to: T };
export type ValueType<T> = T | T[] | RangeType<T>;
export interface Query {
    /**
     * The logical operator used to combine the rules.
     */
    combinator: RuleCombinator;
    /**
     * Indicates whether the rules should be negated.
     */
    not: boolean;
    /**
     * The rules to be applied.
     */
    rules: (Rule | RuleGroup)[];
}

export interface Rule<TValue = any> {
    /**
     * The type of the element used to indicate that it is a rule.
     */
    type: 'rule';
    /**
     * The unique identifier of the rule.
     */
    id: string;
    /**
     * The field to which the rule applies.
     */
    field: string;
    /**
     * The operator used to evaluate the rule.
     */
    operator: string;
    /**
     * The value to be compared against.
     */
    value: ValueType<TValue>;
}

export interface RuleGroup {
    /**
     * The type of the element used to indicate that it is a group of rules.
     */
    type: 'group';
    /**
     * The unique identifier of the rule group.
     */
    id: string;
    /**
     * The logical operator used to combine the rules within the group.
     */
    combinator: RuleCombinator;
    /**
     * Indicates whether the rules within the group should be negated.
     */
    not: boolean;
    /**
     * The rules to be applied within the group.
     */
    rules: (Rule | RuleGroup)[];
}

// --
export interface QueryOperator<TMeta = any> {
    /**
     * The unique identifier of the operator.
     */
    name: string;
    /**
     * The label of the operator.
     */
    label: string;
    /**
     * Whether the operator supports multiple values for each input.
     * This indicates whether the operator can accept an array of values for each input.
     */
    isMulti?: boolean;
    /**
     * Whether the operator supports ranges.
     * This indicates whether the operator can accept a range of values.
     */
    isRange?: boolean;
    /**
     * Any extra metadata
     */
    meta?: TMeta;
}

export interface QueryField<TValue = any, TMeta = any> {
    /**
     * The unique identifier of the field.
     */
    name: string;
    /**
     * The label of the field.
     */
    label: string;
    /**
     * The type of the field.
     * This indicates what kind of data the field holds (e.g., string, number, date).
     */
    type: string;
    /**
     * The operators that can be used with this field.
     */
    operators: QueryOperator[];
    /**
     * The default operator to use when creating a new rule with this field.
     * This is useful for setting a common operator that users can start with.
     * Defaults to the first operator in the list of operators.
     */
    defaultOperator?: string;
    /**
     * The default value to use when creating a new rule with this field.
     * This is useful for setting a common value that users can start with.
     * Defaults to null.
     */
    defaultValue?: ((ctx: { operator: QueryOperator }) => ValueType<TValue>);
    /**
     * Any extra metadata
     */
    meta?: TMeta;
}

// --
export interface QueryBuilderConfig {
    /**
     * The fields that can be used in the query builder.
     * Each field has a name, label, type, and a set of operators that can be used with it.
     */
    fields: QueryField[];
    /**
     * The default combinator to use when creating a new rule group.
     * This is useful for setting a common combinator that users can start with.
     */
    defaultCombinator: RuleCombinator;
}