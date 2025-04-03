# Query Builder Vue

A headless Vue 3 component library for building powerful and customizable query builders with complete UI freedom.

![Query Builder Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🎨 **Fully customizable UI**: Style it any way you want - no pre-defined styles to override
- 🧩 **Headless components**: Functional wrappers with slots that handle the logic, you provide the UI
- 🔌 **Composable API**: Simple component structure that's easy to understand and extend
- 🧠 **Smart state management**: Built-in logic for handling complex query structures
- 🛠️ **TypeScript support**: Full type definitions for excellent developer experience
- ⚡ **Vue 3 and Composition API**: Built with the latest Vue features

## Installation

```bash
# npm
npm install @sketchmonk/query-builder-vue

# yarn
yarn add @sketchmonk/query-builder-vue

# pnpm
pnpm add @sketchmonk/query-builder-vue
```

## Why Headless?

Unlike most query builder libraries that come with predefined UI, this library focuses exclusively on the logic, allowing you to:

- Create a query builder that perfectly matches your application's design system
- Implement custom field types and operators specific to your needs
- Control every aspect of the user experience without fighting against default styles
- Build accessible components tailored to your requirements

## Quick Start

Here's a basic example of how to use the library:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { 
  QueryBuilderRoot,
  type Query, 
  type QueryBuilderConfig
} from '@sketchmonk/query-builder-vue';

// Define your query structure
const query = ref<Query>({
  combinator: 'and',
  rules: [],
  not: false,
});

// Configure your fields and operators
const config: QueryBuilderConfig = {
  defaultCombinator: 'and',
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      operators: [
        { name: 'equal', label: 'Equal' },
        { name: 'contains', label: 'Contains' }
      ],
      defaultOperator: 'equal',
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      operators: [
        { name: 'equal', label: 'Equal' },
        { name: 'greater_than', label: 'Greater than' },
        { name: 'less_than', label: 'Less than' }
      ],
      defaultOperator: 'equal',
    }
  ]
};
</script>

<template>
  <QueryBuilderRoot 
    :config="config"
    v-model:query="query"
    v-slot="{ value, onChange }">
    <!-- Implement your custom UI here -->
    <div class="your-custom-query-builder">
      <!-- Your UI components here -->
    </div>
  </QueryBuilderRoot>
</template>
```

## Core Components

The library provides the following core components:

- `QueryBuilderRoot`: The main component that wraps everything and provides context
- `QueryBuilderRule`: Represents a single rule with field, operator, and value
- `QueryBuilderRuleGroup`: Represents a group of rules with a combinator
- `QueryBuilderRuleFieldSelector`: For selecting a field
- `QueryBuilderRuleOperatorSelector`: For selecting an operator
- `QueryBuilderRuleValueSelector`: For inputting a value
- `QueryBuilderCombinator`: For selecting a logical combinator (AND/OR)

## Complete Example

Here's a more complete example showing how to build a custom UI:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  QueryBuilderRoot, 
  QueryBuilderRuleGroup,
  QueryBuilderRule,
  QueryBuilderRuleFieldSelector,
  QueryBuilderRuleOperatorSelector,
  QueryBuilderRuleValueSelector,
  QueryBuilderCombinator,
  type Query, 
  type QueryBuilderConfig
} from '@sketchmonk/query-builder-vue';

const query = ref<Query>({
  combinator: 'and',
  rules: [],
  not: false,
});

const config = computed<QueryBuilderConfig>(() => ({
  defaultCombinator: 'and',
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      operators: [
        { name: 'equal', label: 'Equal' },
        { name: 'contains', label: 'Contains' }
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
        { name: 'greater_than', label: 'Greater than' }
      ],
      defaultOperator: 'equal',
      defaultValue: () => 18,
    }
  ]
}));
</script>

<template>
  <QueryBuilderRoot 
    :config="config"
    v-model:query="query"
    v-slot="{ value, onChange }">
    <div class="query-builder">
      <QueryBuilderRuleGroup 
        :model-value="value" 
        @update:model-value="onChange"
        v-slot="{ rules, onAddRule, onAddGroup, onRemoveRule, onUpdateRule }">
        <div class="rule-group">
          <QueryBuilderCombinator v-slot="{ value, onChange }">
            <select :value="value" @change="onChange(($event.target as HTMLSelectElement).value as any)">
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>
          </QueryBuilderCombinator>
          
          <div class="rules">
            <div v-for="(rule, index) in rules" :key="index" class="rule-container">
              <!-- For a Rule -->
              <template v-if="rule.type === 'rule'">
                <QueryBuilderRule 
                  :model-value="rule" 
                  @update:model-value="onUpdateRule(index, $event)">
                  <div class="rule">
                    <QueryBuilderRuleFieldSelector v-slot="{ fields, value, onChange }">
                      <select :value="value" @change="onChange(($event.target as HTMLSelectElement).value)">
                        <option v-for="field in fields" :key="field.name" :value="field.name">
                          {{ field.label }}
                        </option>
                      </select>
                    </QueryBuilderRuleFieldSelector>
                    
                    <QueryBuilderRuleOperatorSelector v-slot="{ operators, value, onChange }">
                      <select :value="value" @change="onChange(($event.target as HTMLSelectElement).value)">
                        <option v-for="op in operators" :key="op.name" :value="op.name">
                          {{ op.label }}
                        </option>
                      </select>
                    </QueryBuilderRuleOperatorSelector>
                    
                    <QueryBuilderRuleValueSelector v-slot="{ field, value, onChange }">
                      <input 
                        v-if="field?.type === 'string'" 
                        :value="value" 
                        @input="onChange(($event.target as HTMLInputElement).value)" 
                      />
                      <input 
                        v-else-if="field?.type === 'number'" 
                        type="number" 
                        :value="value" 
                        @input="onChange(Number(($event.target as HTMLInputElement).value))" 
                      />
                    </QueryBuilderRuleValueSelector>
                    
                    <button @click="onRemoveRule(index)">Remove</button>
                  </div>
                </QueryBuilderRule>
              </template>
              
              <!-- For a nested Group -->
              <template v-else-if="rule.type === 'group'">
                <!-- Recursive group rendering -->
              </template>
            </div>
            
            <div class="actions">
              <button @click="onAddRule()">Add Rule</button>
              <button @click="onAddGroup()">Add Group</button>
            </div>
          </div>
        </div>
      </QueryBuilderRuleGroup>
    </div>
  </QueryBuilderRoot>
</template>

<style scoped>
/* Your custom styles here */
</style>
```

## Configuration

### QueryBuilderConfig

The configuration object defines fields, operators, and default behaviors:

```typescript
interface QueryBuilderConfig {
  // Available fields in the query builder
  fields: QueryField[];
  // Default combinator for new rule groups
  defaultCombinator: 'and' | 'or';
}

interface QueryField<TValue = any, TMeta = any> {
  // Unique identifier for the field
  name: string;
  // Display label
  label: string;
  // Field data type (string, number, date, etc.)
  type: string;
  // Available operators for this field
  operators: QueryOperator[];
  // Default operator when creating a new rule
  defaultOperator?: string;
  // Function to provide default values
  defaultValue?: ((ctx: { operator: QueryOperator }) => ValueType<TValue>);
  // Additional custom metadata
  meta?: TMeta;
}

interface QueryOperator<TMeta = any> {
  // Unique identifier
  name: string;
  // Display label
  label: string;
  // Whether multiple values are allowed
  isMulti?: boolean;
  // Whether range values are allowed
  isRange?: boolean;
  // Additional custom metadata
  meta?: TMeta;
}
```

### Query Structure

The query is structured as a tree of rules and groups:

```typescript
interface Query {
  // Logical combination of rules (and/or)
  combinator: 'and' | 'or';
  // Whether to negate the entire group
  not: boolean;
  // Array of rules or nested groups
  rules: (Rule | RuleGroup)[];
}

interface Rule<TValue = any> {
  type: 'rule';
  id: string;
  field: string;
  operator: string;
  value: TValue | TValue[] | { from: TValue; to: TValue };
}

interface RuleGroup {
  type: 'group';
  id: string;
  combinator: 'and' | 'or';
  not: boolean;
  rules: (Rule | RuleGroup)[];
}
```

## Customizing Field Types

You can define any custom field types in your configuration:

```typescript
const config: QueryBuilderConfig = {
  defaultCombinator: 'and',
  fields: [
    // Basic types
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      operators: [/* ... */],
    },
    // Choice fields with options
    {
      name: 'status',
      label: 'Status',
      type: 'choice',
      operators: [/* ... */],
      meta: {
        values: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]
      }
    },
    // Date fields
    {
      name: 'created_at',
      label: 'Created At',
      type: 'date',
      operators: [/* ... */],
    },
    // Custom types
    {
      name: 'location',
      label: 'Location',
      type: 'geo',
      operators: [/* ... */],
    }
  ]
};
```

## Best Practices

1. **Separate UI components**: Create reusable UI components for different field types
2. **Normalize data**: Standardize how you handle different value types
3. **Maintain state**: Use `v-model` and `defineModel` to keep state in sync
4. **Handle validation**: Implement your own validation logic for fields
5. **Accessibility**: Ensure your custom UI is accessible

## Advanced Usage

### Custom Value Components

For complex field types, you can create dedicated components:

```vue
<QueryBuilderRuleValueSelector v-slot="{ field, value, onChange, disabled }">
  <template v-if="field?.type === 'string'">
    <input :disabled="disabled" :value="value" @input="onChange($event.target.value)" />
  </template>
  
  <template v-else-if="field?.type === 'date'">
    <DatePicker :value="value" @change="onChange" :disabled="disabled" />
  </template>
  
  <template v-else-if="field?.type === 'geo'">
    <GeoLocationPicker :value="value" @change="onChange" :disabled="disabled" />
  </template>
</QueryBuilderRuleValueSelector>
```

### Dynamic Fields

You can change available fields based on context:

```vue
<script setup>
const config = computed(() => ({
  fields: isAdmin.value 
    ? [...adminFields, ...regularFields] 
    : regularFields
}));
</script>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

