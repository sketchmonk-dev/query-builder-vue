<script setup lang="ts">
import {
  QueryBuilderRule,
  QueryBuilderRuleFieldSelector,
  QueryBuilderRuleOperatorSelector,
  QueryBuilderRuleValueSelector,
  type Rule,
} from "../../../lib";

const rule = defineModel<Rule>({ required: true })

defineEmits<{
    (e: 'remove'): void;
}>();
</script>
<template>
  <QueryBuilderRule v-model="rule">
    <div class="qb-rule-wrapper">
        <div class="qb-rule">
          <QueryBuilderRuleFieldSelector
            v-slot="{ fields, disabled, value, onChange }"
          >
            <select
              :disabled="disabled"
              :value="value"
              @change="onChange(($event.target as HTMLSelectElement).value)"
            >
              <option v-for="field in fields" :key="field.name" :value="field.name">
                {{ field.label }}
              </option>
            </select>
          </QueryBuilderRuleFieldSelector>
          <QueryBuilderRuleOperatorSelector
            v-slot="{ operators, disabled, value, onChange }"
          >
            <select
              :disabled="disabled"
              :value="value"
              @change="onChange(($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="operator in operators"
                :key="operator.name"
                :value="operator.name"
              >
                {{ operator.label }}
              </option>
            </select>
          </QueryBuilderRuleOperatorSelector>
          <QueryBuilderRuleValueSelector
            v-slot="{ field, value, onChange, disabled }"
          >
            <template v-if="field.type === 'string'">
              <input
                :disabled="disabled"
                :value="value"
                @change="onChange(($event.target as HTMLInputElement).value)"
              />
            </template>
            <template v-if="field.type === 'number'">
              <input
                :disabled="disabled"
                :value="value"
                type="number"
                @change="onChange(($event.target as HTMLInputElement).value)"
              />
            </template>
            <template v-if="field.type === 'choice'">
              <select
                :disabled="disabled"
                :value="value"
                @change="onChange(($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="option in field.meta?.values ?? []"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </template>
          </QueryBuilderRuleValueSelector>
          <button @click="$emit('remove')" type="button">
            Remove
          </button>
        </div>
    </div>
  </QueryBuilderRule>
</template>
<style lang="css">
.qb-rule {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #999;
  padding: 8px;
}
.qb-rule-wrapper {
    display: flex;
    align-items: center;
    gap: 0px;
}
</style>
