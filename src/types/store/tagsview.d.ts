import { RouteLocationNormalized } from 'vue-router';

/**
 * 标签类型声明
 */

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}
export interface TagsViewState {
  visitedViews: TagView[];
  cachedViews: string[];
}