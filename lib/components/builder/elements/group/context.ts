import { produce } from "immer";
import { inject, provide, type Ref } from "vue";
import type { Rule, RuleCombinator, RuleGroup } from "../../../../common";
import { generateRandomUUID } from "../../../../utils";
import { useQueryBuilder } from "../../context";

export interface RuleGroupContext {
    group: Ref<RuleGroup>;
    // -- getters & setters
    getCombinator: () => RuleCombinator;
    setCombinator: (combinator: RuleCombinator) => void;
    getNot: () => boolean;
    setNot: (not: boolean) => void;
    // -- rule actions
    addRule: (index?: number) => void;
    addGroup: (index?: number) => void;
    updateRule: (index: number, rule: Rule | RuleGroup) => void;
    removeRule: (index?: number) => void;
}

const QUERY_BUILDER_GROUP_INJECTION_KEY = Symbol("QUERY_BUILDER_GROUP");

/**
 * Provides a context for managing a query builder group, including operations
 * to manipulate the group's combinator, negation, rules, and nested groups.
 * This function uses Vue's `provide` to make the context available to child components.
 *
 * @param group - A `Ref` containing the `RuleGroup` object to manage.
 * 
 * @returns The `RuleGroupContext` object containing methods to interact with the group.
 *
 * @remarks
 * - The `getCombinator` method retrieves the current combinator of the group.
 * - The `setCombinator` method updates the combinator of the group.
 * - The `getNot` method retrieves the negation (`not`) state of the group.
 * - The `setNot` method updates the negation (`not`) state of the group.
 * - The `addRule` method adds a new rule to the group at the specified index or at the end.
 * - The `addGroup` method adds a new nested group to the group at the specified index or at the end.
 * - The `remove` method removes a rule or group from the group at the specified index or the last one.
 *
 * @example
 * ```typescript
 * const group = ref<RuleGroup>({
 *   id: "group-1",
 *   combinator: "and",
 *   not: false,
 *   rules: [],
 * });
 * 
 * const context = useProvideQueryBuilderGroup(group, 0);
 * context.addRule();
 * context.setCombinator("or");
 * ```
 */
export function useProvideQueryBuilderGroup(group: Ref<RuleGroup>) {

    const { config } = useQueryBuilder();

    const getCombinator = () => {
        return group.value.combinator;
    }
    const setCombinator = (combinator: RuleCombinator) => {
        group.value = {
            ...group.value,
            combinator,
        }
    }
    const getNot = () => {
        return group.value.not;
    }
    const setNot = (not: boolean) => {
        group.value = {
            ...group.value,
            not,
        }
    }
    const addRule = (index?: number) => {
        index = index ?? group.value.rules.length;
        const rule: Rule = {
            type: "rule",
            id: generateRandomUUID(),
            field: "",
            operator: "",
            value: null,
        };
        group.value = produce(group.value, (draft) => {
            draft.rules.splice(index, 0, rule);
        });
    }

    const addGroup = (index?: number) => {
        index = index ?? group.value.rules.length;
        const newGroup: RuleGroup = {
            type: 'group',
            id: generateRandomUUID(),
            combinator: config.value.defaultCombinator,
            not: false,
            rules: [],
        };
        group.value = produce(group.value, (draft) => {
            draft.rules.splice(index, 0, newGroup);
        });
    }

    const removeRule = (index?: number) => {
        index = index ?? group.value.rules.length - 1;
        group.value = produce(group.value, (draft) => {
            draft.rules.splice(index, 1);
        });
    }
    const updateRule = (index: number, rule: Rule | RuleGroup) => {
        group.value = produce(group.value, (draft) => {
            draft.rules[index] = rule;
        });
    }

    const context: RuleGroupContext = {
        group,
        getCombinator,
        setCombinator,
        getNot,
        setNot,
        addRule,
        addGroup,
        updateRule,
        removeRule,
    };

    provide(QUERY_BUILDER_GROUP_INJECTION_KEY, context);
    return context;
}

/**
 * A composable function that provides access to the `RuleGroupContext` within a Query Builder Rule Group.
 * 
 * This function retrieves the context injected by the nearest `QueryBuilderRuleGroup`.
 * If called outside of a `QueryBuilderRuleGroup` component, it will throw an error.
 * 
 * @throws Throws an error if the function is called outside of a `QueryBuilderRuleGroup`.
 * 
 * @returns The context object associated with the Query Builder Rule Group.
 */
export function useQueryBuilderGroup() {
    const context = inject<RuleGroupContext>(QUERY_BUILDER_GROUP_INJECTION_KEY);
    if (!context) {
        throw new Error("useQueryBuilderGroup() is called outside QueryBuilderRuleGroup.");
    }
    return context;
}