<script setup lang="ts">
import { type RuleGroup } from "../../../../common";
import { generateRandomUUID } from "../../../../utils";
import { useQueryBuilder } from "../../context";
import { useProvideQueryBuilderGroup } from "./context";

const { disabled } = useQueryBuilder();

const group = defineModel<RuleGroup>({
  default: () => ({
    id: generateRandomUUID(),
    combinator: "and",
    rules: [],
    not: false,
  }),
});

const { addRule, addGroup, removeRule, updateRule } = useProvideQueryBuilderGroup(group);
</script>
<template>
  <slot
    :disabled="disabled"
    :rules="group.rules"
    :onAddRule="addRule"
    :onAddGroup="addGroup"
    :onRemoveRule="removeRule"
    :onUpdateRule="updateRule"
  />
</template>
