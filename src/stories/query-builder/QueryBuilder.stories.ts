import type { Meta, StoryObj } from '@storybook/vue3';
import QueryBuilder from './QueryBuilder.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'QueryBuilder/QueryBuilder',
  component: QueryBuilder,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};

