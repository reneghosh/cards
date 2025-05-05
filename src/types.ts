export interface Errors {
  error: ErrorFunction;
  addError: AddErrorFunction;
  clearErrors: ClearErrorsFunction;
}
export interface FormGroup {
  withValueMap: WithValueMapFunction<FormGroup>;
  focus: FocusToKeyFunction<FormGroup>;
  select: SelectFunction;
  input: InputFunction;
}
export interface Section extends Errors {
  show: ShowFunction<Section>;
  hide: HideFunction<Section>;
  busy: BusyFunction<Section>;
  available: AvailableFunction<Section>;
  formGroup: FormGroupFunction;
  action: ActionFunction;
  table: TableFunction;
  error: ErrorFunction;
  choice: ChoiceFunction;
}

export interface Action {
  show: ShowFunction<Action>;
  hide: HideFunction<Action>;
  onClick: OnClickFunction;
}
export interface Choice extends Errors {
  setName: SetNameFunction<Choice>;
  focus: FocusFunction<Choice>;
  show: ShowFunction<Choice>;
  hide: HideFunction<Choice>;
  withValue: WithValueFunction<Choice>;
  onChange: OnChangeFunction;
}
export interface Table {
  show: ShowFunction<Table>;
  hide: HideFunction<Table>;
  focus: FocusFunction<Table>;
  addRow: AddRowFunction<Table>;
  onSelect: OnSelectFunction;
  clearAllRows: ClearAllRowsFunction<Table>;
}
export interface ActionsList {
  show: ShowFunction<ActionsList>;
  hide: HideFunction<ActionsList>;
}
export interface Text {
  show: ShowFunction<Text>;
  hide: HideFunction<Text>;
  setText: SetTextFunction<Text>;
}
export interface Input extends Errors {
  focus: FocusFunction<Input>;
  show: ShowFunction<Input>;
  hide: HideFunction<Input>;
  withValue: WithValueFunction<Input>;
  setName: SetNameFunction<Input>;
  onChange: OnChangeFunction;
}
export interface Select extends Errors {
  setName: SetNameFunction<Select>;
  show: ShowFunction<Select>;
  hide: HideFunction<Select>;
  focus: FocusFunction<Select>;
  withValue: WithValueFunction<Select>;
  onChange: OnChangeFunction;
}
export interface Card extends ShowHideable<Card>, Busyable<Card> {
  title: TitleFunction<Card>;
  hideAllSections: HideAllSectionsFunction<Card>;
  showAllSections: ShowAllSectionsFunction<Card>;
  section: MakeSectionFunction;
}
export interface FormGroupFunction {
  (): FormGroup;
}
export interface HideAllSectionsFunction<Type> {
  (): Type;
}
export interface ShowAllSectionsFunction<Type> {
  (): Type;
}
export interface InputFunction {
  (key: string, type: string, prompt: string): Input;
}
export interface SelectFunction {
  (key: string, values: { [key: string]: any }[], prompt: string): Select;
}
export interface TitleFunction<Type> {
  (title: string): Type;
}
export interface ShowFunction<Type> {
  (): Type;
}
export interface HideFunction<Type> {
  (): Type;
}
export interface BusyFunction<Type> {
  (): Type;
}
export interface AvailableFunction<Type> {
  (): Type;
}
export interface FocusFunction<Type> {
  (): Type;
}
export interface FocusToKeyFunction<Type> {
  (key: string): Type;
}
export interface ShowHideable<Type> {
  show: ShowFunction<Type>;
  hide: HideFunction<Type>;
}
export interface Busyable<Type> {
  busy: BusyFunction<Type>;
  available: AvailableFunction<Type>;
}
export interface OnClickFunction {
  (handler: Function): void;
}
export interface OnSelectFunction {
  (handler: Function): void;
}
export interface OnChangeFunction {
  (handler: Function): void;
}
export interface AddRowFunction<Type> {
  (values: any[]): Type;
}
export interface ClearAllRowsFunction<Type> {
  (): Type;
}
export interface SetTextFunction<Type> {
  (text: string): Type;
}
export interface AddErrorFunction {
  (error: string): Errors;
}
export interface ClearErrorsFunction {
  (): Errors;
}
export interface ErrorFunction {
  (error: string): Errors;
}
export interface WithValueFunction<Type> {
  (handler: Function): Type;
}
export interface WithValueMapFunction<Type> {
  (handler: Function): Type;
}
export interface SetNameFunction<Type> {
  (name: string): Type;
}
export interface MakeSectionFunction {
  (title?: string): Section;
}
export interface ActionFunction {
  (title: string): Action;
}
export interface TableFunction {
  (headers: string[]): Table;
}
export interface ChoiceFunction {
  (values: { [key: string]: string }[], prompt: string): Choice;
}
