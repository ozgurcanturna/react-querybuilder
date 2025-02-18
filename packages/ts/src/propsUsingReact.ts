import type {
  ComponentType,
  ForwardRefExoticComponent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react';
import type { RuleGroupTypeAny, RuleGroupTypeIC, RuleOrGroupArray } from 'ruleGroupsIC';
import type {
  Field,
  NameLabelPair,
  OptionGroup,
  ValueEditorType,
  ValueSource,
  ValueSources,
} from './basic';
import type {
  Classnames,
  CombinatorSelectorProps,
  CommonSubComponentProps,
  DragHandleProps,
  FieldSelectorProps,
  NotToggleProps,
  OperatorSelectorProps,
  QueryActions,
  Translations,
  TranslationWithLabel,
  ValueEditorProps,
  ValueSourceSelectorProps,
} from './props';
import type { RuleGroupType, RuleType } from './ruleGroups';
import type { QueryValidator, ValidationMap } from './validation';

export interface ActionProps extends CommonSubComponentProps {
  label?: string;
  handleOnClick(e: ReactMouseEvent): void;
  disabledTranslation?: TranslationWithLabel;
}

export interface ActionWithRulesProps extends ActionProps {
  /**
   * Rules already present for this group
   */
  rules?: RuleOrGroupArray;
}

export interface ActionWithRulesAndAddersProps extends ActionWithRulesProps {
  /**
   * Triggers the addition of a new rule or group. The second parameter will
   * be forwarded to the `onAddRule` or `onAddGroup` callback, appropriately.
   */
  handleOnClick(e: ReactMouseEvent, context?: any): void;
}

export interface InlineCombinatorProps extends CombinatorSelectorProps {
  component: Schema['controls']['combinatorSelector'];
  path: number[];
  independentCombinators?: boolean;
}

export interface Controls {
  addGroupAction: ComponentType<ActionWithRulesAndAddersProps>;
  addRuleAction: ComponentType<ActionWithRulesAndAddersProps>;
  cloneGroupAction: ComponentType<ActionWithRulesProps>;
  cloneRuleAction: ComponentType<ActionProps>;
  combinatorSelector: ComponentType<CombinatorSelectorProps>;
  inlineCombinator: ComponentType<InlineCombinatorProps>;
  dragHandle: ForwardRefExoticComponent<DragHandleProps & RefAttributes<HTMLSpanElement>>;
  fieldSelector: ComponentType<FieldSelectorProps>;
  notToggle: ComponentType<NotToggleProps>;
  operatorSelector: ComponentType<OperatorSelectorProps>;
  lockRuleAction: ComponentType<ActionWithRulesProps>;
  lockGroupAction: ComponentType<ActionWithRulesProps>;
  removeGroupAction: ComponentType<ActionWithRulesProps>;
  removeRuleAction: ComponentType<ActionProps>;
  rule: ComponentType<RuleProps>;
  ruleGroup: ComponentType<RuleGroupProps>;
  valueEditor: ComponentType<ValueEditorProps>;
  valueSourceSelector: ComponentType<ValueSourceSelectorProps>;
}

export interface Schema {
  fields: Field[] | OptionGroup<Field>[];
  fieldMap: Record<string, Field>;
  classNames: Classnames;
  combinators: NameLabelPair[] | OptionGroup[];
  controls: Controls;
  createRule(): RuleType;
  createRuleGroup(): RuleGroupTypeAny;
  getOperators(field: string): NameLabelPair[] | OptionGroup[];
  getValueEditorType(field: string, operator: string): ValueEditorType;
  getValueSources(field: string, operator: string): ValueSources;
  getInputType(field: string, operator: string): string | null;
  getValues(field: string, operator: string): NameLabelPair[] | OptionGroup[];
  showCombinatorsBetweenRules: boolean;
  showNotToggle: boolean;
  showCloneButtons: boolean;
  showLockButtons: boolean;
  autoSelectField: boolean;
  autoSelectOperator: boolean;
  addRuleToNewGroups: boolean;
  enableDragAndDrop: boolean;
  validationMap: ValidationMap;
  independentCombinators: boolean;
  listsAsArrays: boolean;
  disabledPaths: number[][];
}

interface CommonRuleAndGroupProps {
  id?: string;
  path: number[];
  parentDisabled?: boolean;
  translations: Translations;
  schema: Schema;
  actions: QueryActions;
  disabled?: boolean;
  context?: any;
}

export interface RuleGroupProps extends CommonRuleAndGroupProps {
  ruleGroup: RuleGroupTypeAny;
  /**
   * @deprecated Use the `combinator` property of the `ruleGroup` prop instead
   */
  combinator?: string;
  /**
   * @deprecated Use the `rules` property of the `ruleGroup` prop instead
   */
  rules: RuleOrGroupArray;
  /**
   * @deprecated Use the `not` property of the `ruleGroup` prop instead
   */
  not?: boolean;
  dragMonitorId?: string | symbol;
  dropMonitorId?: string | symbol;
  previewRef?: Ref<HTMLDivElement>;
  dragRef?: Ref<HTMLSpanElement>;
  dropRef?: Ref<HTMLDivElement>;
}

export interface RuleProps extends CommonRuleAndGroupProps {
  rule: RuleType;
  /**
   * @deprecated Use the `field` property of the `rule` prop instead
   */
  field: string;
  /**
   * @deprecated Use the `operator` property of the `rule` prop instead
   */
  operator: string;
  /**
   * @deprecated Use the `value` property of the `rule` prop instead
   */
  value: any;
  /**
   * @deprecated Use the `valueSource` property of the `rule` prop instead
   */
  valueSource?: ValueSource;
  dragMonitorId?: string | symbol;
  dropMonitorId?: string | symbol;
  dndRef?: Ref<HTMLDivElement>;
  dragRef?: Ref<HTMLSpanElement>;
}

export interface QueryBuilderContextProps {
  /**
   * Define replacement components.
   */
  controlElements?: Partial<Controls>;
  /**
   * Default is `true`. Set to `false` to avoid calling the onQueryChange
   * callback when the component mounts.
   */
  enableMountQueryChange?: boolean;
  /**
   * This can be used to assign specific CSS classes to various controls
   * that are created by the `<QueryBuilder />`.
   */
  controlClassnames?: Partial<Classnames>;
  /**
   * This can be used to override translatable texts applied to various
   * controls that are created by the `<QueryBuilder />`.
   */
  translations?: Partial<Translations>;
  /**
   * Enables drag-and-drop features
   */
  enableDragAndDrop?: boolean;
  /**
   * Enables debug logging for QueryBuilder and React DnD
   */
  debugMode?: boolean;
}

export type QueryBuilderContextProviderProps = QueryBuilderContextProps & {
  children?: ReactNode;
};
export type QueryBuilderContextProvider<ExtraProps extends object = Record<string, any>> =
  ComponentType<QueryBuilderContextProviderProps & ExtraProps>;

type QueryBuilderPropsBase<RG extends RuleGroupType | RuleGroupTypeIC> = (RG extends {
  combinator: string;
}
  ? {
      independentCombinators?: false;
    }
  : {
      /**
       * Allows independent and/or configuration between rules
       */
      independentCombinators: true;
    }) &
  QueryBuilderContextProps & {
    /**
     * When `debugMode` is `true`, each log object will be passed to
     * this function (otherwise `console.log` is used)
     */
    onLog?(obj: any): void;
    /**
     * The array of fields that should be used. Each field should be an object
     * with {name: String, label: String}
     */
    fields?: Field[] | OptionGroup<Field>[] | Record<string, Field>;
    /**
     * The array of operators that should be used.
     * @default
     * [
     *   { name: '=', label: '=' },
     *   { name: '!=', label: '!=' },
     *   { name: '<', label: '<' },
     *   { name: '>', label: '>' },
     *   { name: '<=', label: '<=' },
     *   { name: '>=', label: '>=' },
     *   { name: 'contains', label: 'contains' },
     *   { name: 'beginsWith', label: 'begins with' },
     *   { name: 'endsWith', label: 'ends with' },
     *   { name: 'doesNotContain', label: 'does not contain' },
     *   { name: 'doesNotBeginWith', label: 'does not begin with' },
     *   { name: 'doesNotEndWith', label: 'does not end with' },
     *   { name: 'null', label: 'is null' },
     *   { name: 'notNull', label: 'is not null' },
     *   { name: 'in', label: 'in' },
     *   { name: 'notIn', label: 'not in' },
     *   { name: 'between', label: 'between' },
     *   { name: 'notBetween', label: 'not between' },
     * ]
     */
    operators?: NameLabelPair[] | OptionGroup[];
    /**
     * The array of combinators that should be used for RuleGroups.
     * @default
     * [
     *     {name: 'and', label: 'AND'},
     *     {name: 'or', label: 'OR'},
     * ]
     */
    combinators?: NameLabelPair[] | OptionGroup[];
    /**
     * The default field for new rules. This can be a string identifying the
     * default field, or a function that returns a field name.
     */
    getDefaultField?: string | ((fieldsData: Field[] | OptionGroup<Field>[]) => string);
    /**
     * The default operator for new rules. This can be a string identifying the
     * default operator, or a function that returns an operator name.
     */
    getDefaultOperator?: string | ((field: string) => string);
    /**
     * Returns the default value for new rules.
     */
    getDefaultValue?(rule: RuleType): any;
    /**
     * This is a callback function invoked to get the list of allowed
     * operators for the given field. If `null` is returned, the default
     * operators are used.
     */
    getOperators?(field: string): NameLabelPair[] | OptionGroup[] | null;
    /**
     * This is a callback function invoked to get the type of `ValueEditor`
     * for the given field and operator.
     */
    getValueEditorType?(field: string, operator: string): ValueEditorType;
    /**
     * This is a callback function invoked to get the list of valid
     * value sources for a given field and operator. The return value must
     * be an array that includes at least one of the valid value source:
     * "value", "field", or both.
     */
    getValueSources?: (field: string, operator: string) => ValueSources;
    /**
     * This is a callback function invoked to get the `type` of `<input />`
     * for the given field and operator (only applicable when
     * `getValueEditorType` returns `"text"` or a falsy value). If no
     * function is provided, `"text"` is used as the default.
     */
    getInputType?(field: string, operator: string): string | null;
    /**
     * This is a callback function invoked to get the list of allowed
     * values for the given field and operator (only applicable when
     * `getValueEditorType` returns `"select"` or `"radio"`). If no
     * function is provided, an empty array is used as the default.
     */
    getValues?(field: string, operator: string): NameLabelPair[] | OptionGroup[];
    /**
     * This callback is invoked before a new rule is added. The function should either manipulate
     * the rule and return it, or return `false` to cancel the addition of the rule.
     */
    onAddRule?(rule: RuleType, parentPath: number[], query: RG, context?: any): RuleType | false;
    /**
     * This callback is invoked before a new group is added. The function should either manipulate
     * the group and return it, or return `false` to cancel the addition of the group.
     */
    onAddGroup?(ruleGroup: RG, parentPath: number[], query: RG, context?: any): RG | false;
    /**
     * This is a callback function that is invoked anytime the query configuration changes.
     */
    onQueryChange?(query: RG): void;
    /**
     * Show the combinators between rules and rule groups instead of at the top of rule groups.
     */
    showCombinatorsBetweenRules?: boolean;
    /**
     * Show the "not" toggle for rule groups.
     */
    showNotToggle?: boolean;
    /**
     * Show the "Clone rule" and "Clone group" buttons
     */
    showCloneButtons?: boolean;
    /**
     * Show the "Lock rule" and "Lock group" buttons
     */
    showLockButtons?: boolean;
    /**
     * Reset the operator and value components when the `field` changes.
     */
    resetOnFieldChange?: boolean;
    /**
     * Reset the value component when the `operator` changes.
     */
    resetOnOperatorChange?: boolean;
    /**
     * Select the first field in the array automatically
     */
    autoSelectField?: boolean;
    /**
     * Select the first operator in the array automatically
     */
    autoSelectOperator?: boolean;
    /**
     * Adds a new default rule automatically to each new group
     */
    addRuleToNewGroups?: boolean;
    /**
     * Store list-type values as native arrays instead of comma-separated strings
     */
    listsAsArrays?: boolean;
    /**
     * Disables the entire query builder if true, or the rules and groups at
     * the specified paths (as well as all child rules/groups and subcomponents)
     * if an array of paths is provided. If the root path is specified (`disabled={[[]]}`),
     * no changes to the query are allowed.
     *
     * @deprecated This prop may be removed in a future major version. Use the `disabled`
     * property on rules and groups within the `query`/`defaultQuery` instead.
     */
    disabled?: boolean | number[][];
    /**
     * Query validation function
     */
    validator?: QueryValidator;
    /**
     * Container for custom props that are passed to all components
     */
    context?: any;
  };

/**
 * Props for the `<QueryBuilder />` component. Note that if `independentCombinators`
 * is `true`, then `query` and `defaultQuery` must be of type `RuleGroupTypeIC`. Otherwise,
 * they must be of type `RuleGroupType`. Only one of `query` or `defaultQuery` can be
 * provided. If `query` is present, then `defaultQuery` must be undefined, and vice versa.
 * If rendered initially with a `query` prop, then `query` must always be defined in every
 * subsequent render or errors will be logged to the console (in "development" mode only).
 */
export type QueryBuilderProps<RG extends RuleGroupType | RuleGroupTypeIC = RuleGroupType> =
  | (QueryBuilderPropsBase<RG> & {
      /**
       * Initial query object for uncontrolled components
       */
      defaultQuery?: RG;
      query?: never;
    })
  | (QueryBuilderPropsBase<RG> & {
      defaultQuery?: never;
      /**
       * Query object for controlled components
       */
      query?: RG;
    });
