<script setup lang="ts">
import type { RuleGroup } from '../../../lib';
import QueryBuilderCombinator from '../../../lib/components/builder/elements/group/QueryBuilderCombinator.vue';
import QueryBuilderRuleGroup from '../../../lib/components/builder/elements/group/QueryBuilderRuleGroup.vue';
import QBRule from './QBRule.vue';


const group = defineModel<RuleGroup>({ required: true });
</script>
<template>
    <QueryBuilderRuleGroup v-model="group" v-slot="{ rules, onUpdateRule, onAddRule, onAddGroup, onRemoveRule }">
        <div class="qb-rule-group">
            <QueryBuilderCombinator v-slot="{ value, onChange }">
                <select style="width: 60px" :value="value" @change="onChange(($event.target as HTMLSelectElement).value as any)">
                    <option value="and">AND</option>
                    <option value="or">OR</option>
                </select>
            </QueryBuilderCombinator>
            <div class="qb-rule-group__tree">
                <div class="qb-rule-group__stem" />
                <div class="qb-rule-group__rules">
                    <div class="qb-rule-group__branch" v-for="(rule, index) in rules" :key="index">
                        <QBRule
                            v-if="rule.type === 'rule'"
                            :model-value="rule"
                            @update:model-value="onUpdateRule(index, $event)"
                            @remove="onRemoveRule(index)"
                        />
                        <QBRuleGroup
                            v-if="rule.type === 'group'"
                            :model-value="rule"
                            @update:model-value="onUpdateRule(index, $event)"
                            @remove="onRemoveRule(index)"
                        />
                    </div>
                    <div class="qb-rule-group__branch">
                        <div class="qb-rule-group__actions">
                            <button @click="onAddRule()">+ Add Rule</button>
                            <button @click="onAddGroup()">+ Add Group</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </QueryBuilderRuleGroup>
</template>
<style lang="css">
.qb-rule-group {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 8px;
    background: white;
    border: 1px solid #999;
}
.qb-rule-group__rules {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.qb-rule-group__tree {
    display: flex;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative;
    gap: 0px;
}
.qb-rule-group__actions {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: white;
    border: 1px solid #999;
}
.qb-rule-group__stem {
    position: absolute;
    left: 30px;
    top: 0px;
    height: calc(100% - 31px);
    width: 0px;
    border-right: 1px solid #999;
}
.qb-rule-group__branch {
    display: flex;
    align-items: center;
    margin-left: 30px;
}
.qb-rule-group__branch::before {
    content: '';
    display: block;
    width: 20px;
    height: 0px;
    border-top: 1px solid #999;
}
</style>