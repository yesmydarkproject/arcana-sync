import type { Writable } from 'svelte/store';
import type { ArcanaRecord } from './types';

export const currentTimeContextKey = Symbol('currentTime');
export type CurrentTimeContext = Writable<number>;

export const showHoursContextKey = Symbol('showHours');
export type ShowHoursContext = Writable<boolean>;

export const recordsContextKey = Symbol('records');
export type RecordsContext = Writable<ArcanaRecord[]>;
