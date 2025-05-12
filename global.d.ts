// Extend the built-in ImportMeta so TS knows about `.url`
declare interface ImportMeta {
  readonly url: string;
}
