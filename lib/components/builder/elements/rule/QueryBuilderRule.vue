<script setup lang="ts">
import type { Rule } from '../../../../common';
import { generateRandomUUID } from '../../../../utils';
import { useQueryBuilder } from '../../context';
import { useProvideQueryBuilderRule } from './context';

const rule = defineModel<Rule>({
    default: () => ({
        id: generateRandomUUID(),
        field: '',
        operator: '',
        value: '',
    }),
})

const { disabled } = useQueryBuilder ();

useProvideQueryBuilderRule(rule);
</script>
<template>
    <slot :disabled="disabled" :rule="rule" />
</template>