<script setup lang="ts">
import { computed } from 'vue';
import { useQueryBuilderRule } from './context';
import { useQueryBuilder } from '../../context';


const { getField, getOperator, getValue, setValue } = useQueryBuilderRule();
const { disabled: qbDisabled } = useQueryBuilder();

const disabled = computed(() => {
    return !getField() || !getOperator() || qbDisabled.value;
});

const field = computed(() => getField());
const operator = computed(() => getOperator());
</script>
<template>
    <slot
        v-if="field && operator"
        :field="field!"
        :operator="operator"
        :value="getValue()"
        :onChange="setValue"
        :disabled="disabled"
    />
</template>