<script setup lang="ts">
import { useQueryBuilder } from '../../context';
import { useQueryBuilderGroup } from './context';

const { disabled } = useQueryBuilder();

const { getCombinator, setCombinator } = useQueryBuilderGroup();
</script>
<template>
    <slot
        :disabled="disabled"
        :value="getCombinator()"
        :onChange="setCombinator"
    />
</template>