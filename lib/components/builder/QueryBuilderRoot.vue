<script setup lang="ts">
import { computed } from 'vue';
import type { Query, QueryBuilderConfig, RuleGroup } from '../../common';
import { useProvideQueryBuilder } from './context';

const props = withDefaults(
    defineProps<{
        config: QueryBuilderConfig;
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    }
);

const query = defineModel<Query>('query', {
    default: () => ({
        combinator: 'and',
        rules: [],
        not: false,
    }),
})

const config = computed(() => props.config);
const disabled = computed(() => props.disabled);

useProvideQueryBuilder({ query, config, disabled });

const group = computed(() => {
    return {
        type: 'group',
        id: 'root',
        ...query.value,
    } as RuleGroup;
})

const onChange = (group: RuleGroup) => {
    query.value = {
        combinator: group.combinator,
        rules: group.rules,
        not: group.not,
    };
}
</script>
<template>
    <slot
        :disabled="disabled"
        :value="group"
        :onChange="onChange"
    />
</template>