import ko from "knockout";
import _ from "lodash";

import api from "js/common/api";
import Pages from "js/common/pages.enum";
import Folder from "js/models/folder.viewmodel";
import template from "./sidebar.template.html";
import Command from "js/models/command.viewmodel";
import path from "path";

export class SidebarViewmodel {

    constructor(params) 
    {
        console.log("SidebarViewmodel::constructor");
        var self = this;
        this.subs = [];
        this.bookmarks = params.bookmarks;
        this.currentPage = params.currentPage;
        this.appCommands = params.appCommands;
        this.currentFolder = params.currentFolder;
        this.selectedDirectory = params.selectedDirectory;
        this.folders = ko.observableArray();

        this.selectDirectory = this.selectDirectory.bind(this);
        this.selectDirectoryText = ko.pureComputed(this.selectDirectoryText, this);
        this.isFavoritesActive = ko.pureComputed(this.isFavoritesActive, this);
        this.directories = ko.pureComputed(this.getFolderTree, this).extend({ rateLimit: 50 });

        this.commands = [
            new Command(this.appCommands().OPEN_DIRECTORY, this.openDirectory)
        ]
        this.initialize();
    }

    initialize() {
        let self = this;
        let currentFolder = this.currentFolder();
        let isBookmarked = _(this.bookmarks()).map('folderPath').includes(this.currentFolder());
        console.log("SidebarViewmodel::initialize- currentFolder:", currentFolder);
        if (currentFolder) {
            let baseName = path.basename(currentFolder);
            var root = new Folder({
                folderName: baseName,
                folderPath: currentFolder,
                isBookmarked: isBookmarked
            });
            self.folders([root]);
            root.isOpen(true); //initialize to call API.
            self.selectedDirectory(root);
        }
    };
    recursive(folder, array) {
        array.push(folder);
        if (folder.isOpen()) {
            folder.children().forEach((child) => this.recursive(child, array));
        }
        return array;
    }
    getFolderTree() {
        console.log("SidebarViewmodel::getFolderTree");
        let array = [];
        this.folders().forEach((child) => this.recursive(child, array));
        return array;
    }

    selectDirectory(folder) {
        this.selectedDirectory(folder);
        this.currentPage(Pages.MangaList);
    }

    selectDirectoryText() {
        // console.log(this.selectedDirectory().folderName);
        return this.selectedDirectory() ? this.selectedDirectory().folderName : "";
    }

    openDirectory() {
        var self = this;
        api.selectDirectory().then(function(folder) {
            console.log(`You selected ${folder}`);
            self.currentFolder(folder);
            self.initialize();
        });
    }

    showFavorites() {
        this.currentPage(Pages.MangaList);
        this.selectedDirectory(null);
    }

    showSettings() {
        this.currentPage(Pages.SettingsPage);
        this.selectedDirectory(null);
    }

    isFavoritesActive() {
        return this.currentPage() == Pages.FavortiesList;
    }

    dispose() {
        console.log("SidebarViewmodel:executing dispose");
    };

    static registerComponent() {
        ko.components.register("sidebar", {
            viewModel: SidebarViewmodel,
            template: template,
            synchronous: true
        });
    };
}

SidebarViewmodel.registerComponent();
