import process from "process";

const { env } = process;

export const VERBOSE_DB = !!env["VERBOSE_DB"];
