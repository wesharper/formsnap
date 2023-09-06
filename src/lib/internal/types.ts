import type { Action } from "svelte/action";
import type { Writable } from "svelte/store";
import type { FormPathLeaves, UnwrapEffects, ZodValidation } from "sveltekit-superforms";
import type { SuperForm, formFieldProxy } from "sveltekit-superforms/client";
import type { AnyZodObject, z } from "zod";

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

export type ExpandDeep<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandDeep<O[K]> }
		: never
	: T;

export type Form<T extends Validation> = {
	schema: T;
	form: SuperForm<T, unknown>;
};
export type Arrayable<T> = T | T[];

export type FormValidation = Validation;
export type FormFieldName<T extends Validation> = FormPathLeaves<z.infer<T>>;

export type FormFieldContext = {
	/**
	 * The name of the field in the form schema.
	 */
	name: string;

	/**
	 * An object containing the ids of the form field's elements.
	 * The keys are the element names and the values are the ids.
	 * Use this object to set appropriate aria and htmlFor attributes
	 * when composing your own form field components.
	 */
	ids: {
		input: string;
		description: string;
		validation: string;
	};

	/**
	 * A writable store containing an array of validation errors
	 * if they exist, or undefined if they don't. Useful for displaying
	 * errors in a custom validation message component.
	 */
	errors: Writable<string[] | undefined>;

	/**
	 * A writable store containing the current value of the field.
	 */
	value: Writable<unknown>;

	/**
	 * A writable store which is true if the field has a description component,
	 * or false if it doesn't. This is used internally to set the appropriate
	 * aria attributes depending on whether the field has description component.
	 * It is updated automatically when using the description action.

	 */
	hasDescription: Writable<boolean>;

	/**
	 * A writable store which is true if the field has a validation component,
	 * or false if it doesn't. This is used internally to set the appropriate
	 * aria attributes depending on whether the field has validation component.
	 * It is updated automatically when using the validation action.

	 */
	hasValidation: Writable<boolean>;

	/**
	 * A store containing the attributes of the form input element. It should be
	 * applied as a subscription to the store so that the attributes are updated
	 * as the state of the form changes.
	 */
	attrStore: AttrStore;

	/**
	 * An object containing actions for each element of the form field. These actions
	 * can be applied to the elements of your custom form field components to set
	 * the appropriate attributes and event handlers.
	 */
	actions: ActionsObject;

	/**
	 * An object containing event handlers for each element of the form field. These
	 * handlers can be applied to the elements of your custom form field components to
	 * handle the appropriate events.
	 */
	handlers: Handlers;

	/**
	 * A setter function for the value of the field. This function is useful when working
	 * with third party components where you want to set the value of the field using a
	 * custom event handler or other means.
	 */
	setValue: SetValue;
};

export type AttrStore = Writable<Record<string, unknown>>;

export type FieldAttrs<T> = {
	"aria-invalid"?: boolean;
	"aria-describedby"?: string;
	name: string;
	id: string;
	value: T;
};

export type ControlFieldAttrs<T> = {
	control: Omit<FieldAttrs<T>, "name">;
	input: Pick<FieldAttrs<T>, "value" | "name">;
};

export type FormStores<
	T extends ZodValidation<AnyZodObject>,
	Path extends FormPathLeaves<z.infer<UnwrapEffects<T>>>
> = ReturnType<typeof formFieldProxy<T, Path>>;

export type FormInputEvent = Event & {
	currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
};

export type FormCheckboxEvent = Event & {
	currentTarget: HTMLInputElement;
};

export type ActionsObject = {
	/**
	 * An action for setting the attributes and event handlers for a checkbox component.
	 *
	 * @usage `<input type="checkbox" use:actions.checkbox />`
	 */
	checkbox: Action<HTMLInputElement>;

	/**
	 * An action for setting up the attributes & state for a description component.
	 *
	 * @usage `<span use:actions.description>...</span>`
	 */
	description: Action<HTMLElement>;

	/**
	 * An action for setting up the attributes & event handlers for a standard input component.
	 *
	 * @usage `<input use:actions.input />`
	 */
	input: Action<HTMLInputElement>;

	/**
	 * An action for setting up the attributes for a label component.
	 *
	 * @usage `<label use:actions.label>...</label>`
	 */
	label: Action<HTMLLabelElement>;

	/**
	 * An action for setting up the attributes & event handlers for a radio input component.
	 *
	 * @usage `<input type="radio" use:actions.radio />`
	 */
	radio: Action<HTMLInputElement>;

	/**
	 * An action for setting up the attributes & event handlers for a select component.
	 *
	 * @usage `<select use:actions.select>...</select>`
	 */
	select: Action<HTMLSelectElement>;

	/**
	 * An action for setting up the attributes & event handlers for a textarea component.
	 *
	 * @usage `<textarea use:actions.textarea />`
	 */
	textarea: Action<HTMLTextAreaElement>;

	/**
	 * An action for setting up the attributes & state for a description component.
	 *
	 * @usage `<p use:actions.validation>...</p>`
	 */
	validation: Action<HTMLElement>;
};

export type Validation = ZodValidation<AnyZodObject>;

export type GetFieldAttrsProps<T> = {
	val: T;
	errors: string[] | undefined;
	constraints: Record<string, unknown> | undefined;
	hasValidation: boolean;
	hasDescription: boolean;
};

/**
 * Sets the value of a field store to the given value.
 */
export type SetValue = (value: unknown) => void;

/**
 * An object of helper functions for setting the value of a field store
 * using `on:input` and `on:change` for native form elements and their
 * events.
 */
export type Handlers = {
	input: (e: Event) => void;
	checkbox: (e: Event) => void;
	radio: (e: Event) => void;
	select: (e: Event) => void;
};
