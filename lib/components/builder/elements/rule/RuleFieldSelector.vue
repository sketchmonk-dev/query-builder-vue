<script setup lang="ts">
import { computed } from 'vue';
import { useQueryBuilder } from '../../context';
import { useQueryBuilderRule } from './context';

const { getField, setField } = useQueryBuilderRule();
const { config, disabled } = useQueryBuilder();

const field = computed(() => getField());
</script>
<template>
    <slot
        :disabled="disabled"
        :fields="config.fields" 
        :field="field" 
        :value="field?.name" 
        :onChange="setField"
    />
</template>