<script setup lang="ts">
import { computed, ref } from 'vue';
import { type QueryBuilderConfig, QueryBuilderRoot, type Query } from '../../../lib';
import QBRuleGroup from './QBRuleGroup.vue';


const query = ref<Query>({
    combinator: 'and',
    rules: [],
    not: false,
})

const config = computed<QueryBuilderConfig>(() => {
    return {
        defaultCombinator: 'and',
        fields: [
            {
                name: 'name',
                label: 'Name',
                type: 'string',
                operators: [
                    { name: 'equal', label: 'Equal' },
                    { name: 'not_equal', label: 'Not equal' },
                    { name: 'contains', label: 'Contains' },
                    { name: 'not_contains', label: 'Not contains' }
                ],
                defaultOperator: 'equal',
                defaultValue: () => '',
            },
            {
                name: 'age',
                label: 'Age',
                type: 'number',
                operators: [
                    { name: 'equal', label: 'Equal' },
                    { name: 'not_equal', label: 'Not equal' },
                    { name: 'greater_than', label: 'Greater than' },
                    { name: 'less_than', label: 'Less than' }
                ],
                defaultOperator: 'equal',
                defaultValue: () => 18,
            },
            {
                name: 'department',
                label: 'Department',
                type: 'choice',
                operators: [
                    { name: 'equal', label: 'Equal' },
                    { name: 'not_equal', label: 'Not equal' }
                ],
                defaultOperator: 'equal',
                defaultValue: () => 'human_resources',
                meta: {
                    values: [
                        { name: 'human_resources', label: 'Human Resources' },
                        { name: 'engineering', label: 'Engineering' },
                        { name: 'sales', label: 'Sales' },
                        { name: 'marketing', label: 'Marketing' }
                    ]
                }
            }
        ]
    }
})
</script>
<template>
    <QueryBuilderRoot 
        :config="config"
        v-slot="{ value, onChange }"
        v-model:query="query">
        <QBRuleGroup
            :model-value="value"
            @update:model-value="onChange"
        />
    </QueryBuilderRoot>
</template>