import {
	Notice,
	Plugin,
	TFile
} from 'obsidian';


export default class MyPlugin extends Plugin {

	async onload() {

		const {vault} = this.app;

		/**
		 * Language:
		 * title contains/starts_with/ends_with <exp>;;
		 * order_by title/mtime asc/desc;;
		 * */

		this.addCommand({
			id: "lister",
			name: "Lister",
			callback: async () => {
				this.lister();
			},
		});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('links-coming-in', 'Lister', (evt: MouseEvent) => {
			this.lister();
		});


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}

	async lister() {
		const {vault, workspace} = this.app;

		const file = workspace.getActiveFile();
		const contents = await vault.cachedRead(file);

		if (contents.indexOf('%%lister') === -1 || contents.indexOf('/lister%%') === -1) {
			new Notice('No lister command found');
			return;
		}

		let commandStr = contents.substring(contents.indexOf('%%lister'));
		commandStr = commandStr.substring(8, commandStr.indexOf('/lister%%'));
		commandStr = commandStr.trim();


		const commands = commandStr.split(';;');
		let files = vault.getFiles();

		const filteredFiles = this.process(files, commands);

		const prefixWithCommand = contents.substring(0, contents.indexOf('/lister%%') + 10);
		const suffixAfterCommand = contents.substring(contents.indexOf('/lister%%') + 10);

		const newContent = prefixWithCommand + this.generateLinks(filteredFiles) + suffixAfterCommand;

		workspace.activeLeaf.view.editor?.cm.setValue(newContent);
	}

	process(files: TFile[], commands: any) {
		let filteredFiles = [...files];
		commands.forEach((command: string) => {
			command = command.trim();
			if(!command) {
				return;
			}
			const [subject, operator, $2] = command.split(" ");
			switch (subject) {
				case 'title':
					filteredFiles = this.filter(filteredFiles, operator, $2);
					break;
				case 'order_by':
					filteredFiles = this.sort(filteredFiles, operator, !$2 || $2 === 'asc');
					break;
			}
		});
		return filteredFiles;
	}

	sort(files: TFile[], operator: string, asc: boolean): TFile[] {
		let sortedFiles: TFile[] = [];
		if (operator === 'title') {
			sortedFiles = files.sort((a: any, b: any) => {
				return a.path >= b.path ? 1 : -1;
			});
		} else if (operator === 'mtime') {
			sortedFiles = files.sort((a: any, b: any) => {
				return a.stat.mtime >= b.stat.mtime ? 1 : -1;
			});
		}

		return asc ? sortedFiles : sortedFiles.reverse();
	}

	filter(files: TFile[], operator: string, keyword: string): TFile[] {
		return files.filter((file: TFile) => {
			switch (operator) {
				case 'contains':
					return file.path.indexOf(keyword) >= 0;
				case 'starts_with':
					return file.path.indexOf(keyword) === 0;
				case 'ends_with':
					return (file.path.indexOf(keyword) + keyword.length) === file.path.length;
				default:
					return false;
			}
		});
	}

	generateLinks (files: TFile[]): string {
		let str = '\n';
		for (let i = 0; i < files.length; i++) {
			const path = files[i].path.replace('.md', '');
			str = `${str} \n[[${path}]]`;
		}
		str = str + '\n\n';
		return str;
	}

	printFiles (files: TFile[]) {
		console.log(files.map(file => file.path).join(" "));
	}

}
