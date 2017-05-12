import ko from "knockout";
import _ from "lodash";
import path from "path";

import api from "renderer-process/common/api.js";
import Pages from "renderer-process/common/pages.enum";
import Folder from "renderer-process/models/folder.viewmodel.js";
import { DefaultCommandHotkeys } from "renderer-process/models/command.viewmodel";
const { remote } = window.require('electron');
export default class ViewModel {
    constructor(params) {
        console.log("MainViewModel::constructor")
        params.bookmarks = _.without(params.bookmarks, null);
        let self = this;
        this.subscriptions = [];
        this.appTitle = ko.observable("Baiji Manga Viewer");
        this.currentPage = ko.observable(params.currentPage || Pages.MangaList);
        this.currentFolder = ko.observable(params.currentFolder);
        this.selectedDirectory = ko.observable();
        this.favorites = ko.observableArray(params.favorites);
        this.selectedManga = ko.observable();
        this.selectedMangaPath = ko.observable(params.selectedMangaPath);
        this.currentViewMangaPage = ko.observable(0);
        this.viewMangaCommand = ko.observable(null).extend({ notify: 'always' });
        this.pagination = ko.observable(0);
        this.scrollEnd = ko.observable(false).extend({ rateLimit: 500 });
        this.appCommands = ko.observable(_.extend({}, DefaultCommandHotkeys, params.appCommands));
        this.bookmarks = ko.observableArray(this.getBookmarks(params));
        this.searching = ko.observable(false);
        this.isRecursive = ko.observable(params.isRecursive);

        this.initialize();
    }

    initialize() {
        let sub = ko.computed(function() {
            let currentFolder = this.currentFolder();
            let bookmarks = _.map(this.bookmarks(), 'folderPath');
            let favorites = this.favorites();
            let selectedMangaPath = this.selectedManga() ? this.selectedManga().folderPath : this.selectedMangaPath();
            let appCommands = _.extend({}, DefaultCommandHotkeys, this.appCommands());
            api.writeSettings({
                currentFolder,
                bookmarks,
                favorites,
                isRecursive: this.isRecursive(),
                currentPage: this.currentPage(),
                appCommands: appCommands,
                selectedMangaPath: selectedMangaPath

            });
        }, this).extend({
            rateLimit: 500
        });

        let sub2 = this.selectedManga.subscribe(function(manga) {
            if (manga) {
                this.selectedDirectory(null);
            }
        }, this);

        this.subscriptions.push(sub);
        this.subscriptions.push(sub2);
    }

    dispose() {
        this.subscriptions.forEach(sub => sub.dispose());
    }

    getBookmarks(params) {
        return _.map(params.bookmarks, function(folderPath) {
            let folderName = path.basename(folderPath);
            return new Folder({
                folderName: folderName,
                folderPath: folderPath,
                isBookmarked: true
            });
        })
    }
    closeWindow() {
        let current = remote.getCurrentWindow();
        current.close();
    }
}