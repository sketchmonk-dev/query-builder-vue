<script setup lang="ts">
import { computed } from 'vue';
import { useQueryBuilder } from '../../context';
import { useQueryBuilderRule } from './context';


const { getField, getOperator, setOperator } = useQueryBuilderRule();
const { disabled: qbDisabled } = useQueryBuilder();

const disabled = computed(() => {
    return !getField() || qbDisabled.value;
});

const field = computed(() => getField());
const operators = computed(() => {
    if (field.value) {
        return field.value.operators;
    }
    return [];
})

const operator = computed(() => getOperator());
</script>
<template>
    <slot
        :operators="operators"
        :operator="operator"
        :field="field"
        :disabled="disabled"
        :value="operator?.name"
        :onChange="setOperator"
    />
</template>