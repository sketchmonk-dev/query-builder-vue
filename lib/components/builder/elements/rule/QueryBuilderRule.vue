<script setup lang="ts">
import type { Rule } from '../../../../common';
import { generateRandomUUID } from '../../../../utils';
import { useProvideQueryBuilderRule } from './context';

const rule = defineModel<Rule>({
    default: () => ({
        id: generateRandomUUID(),
        field: '',
        operator: '',
        value: '',
    }),
})

useProvideQueryBuilderRule(rule);
</script>
<template>
    <slot :rule="rule" />
</template>