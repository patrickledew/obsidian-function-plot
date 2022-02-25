import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianFunctionPlotter from "./main";

export interface OFPSettings {
	optionsPrefix: string
}

export const DEFAULT_SETTINGS: Partial<OFPSettings> = {
	optionsPrefix: "#"
}
export class OFPSettingTab extends PluginSettingTab {
    plugin: ObsidianFunctionPlotter;

    constructor(app: App, plugin: ObsidianFunctionPlotter) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Function Plot Options Prefix")
            .setDesc("The symbol to use for function plot options (e.g. range, variable, color, style).\
                      Every line not prefixed with this character is interpreted as a function, and every\
                      line with this character is interpreted as an option.")
            .addText((text) => {
                return text
                    .setPlaceholder("Default '#'")
                    .setValue(this.plugin.settings.optionsPrefix)
                    .onChange(async (value) => {
                        this.plugin.settings.optionsPrefix = value;
                        await this.plugin.saveSettings();
                    })
            });
    }
}