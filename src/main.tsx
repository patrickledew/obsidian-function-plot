import { Plugin } from 'obsidian';
// Remember to rename these classes and interfaces!
import * as React from "react";
import * as ReactDOM from "react-dom";
import { FunctionPlotView } from "./components/FunctionPlotView/FunctionPlotView";
import { OFPSettingTab, OFPSettings, DEFAULT_SETTINGS } from './settings';



export default class ObsidianFunctionPlotter extends Plugin {
	settings: OFPSettings;


	async onload() {
		this.loadSettings();
		this.addSettingTab(new OFPSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor("plot", (src, el, ctx) => {ReactDOM.render(<FunctionPlotView src={src} settings={this.settings} />, el)})
		console.log("Obsidian Function Plotter Loaded.")
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}