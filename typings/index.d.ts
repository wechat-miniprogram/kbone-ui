import Vue from 'vue'

export interface InstallationOptions {
    locale: any,
    i18n: any,
    size: string
}

/**
 * Install all kbone-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(KboneUI)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void