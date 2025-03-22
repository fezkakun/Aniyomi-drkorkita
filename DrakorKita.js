import { Source, Manga } from "@tachiyomi/manga";
import { Chapter, Page } from "@tachiyomi/chapter";
import { fetchHtml, fetchJson } from "@tachiyomi/network";

const BASE_URL = "https://drakorkita.com";

export default class DrakorKita extends Source {
    constructor() {
        super("DrakorKita", "https://drakorkita.com", "id");
    }

    async getMangaList() {
        const document = await fetchHtml(`${BASE_URL}/daftar-drama/`);
        const elements = document.querySelectorAll(".list-update_item");
        return Array.from(elements).map(element => new Manga({
            id: element.querySelector("a").getAttribute("href"),
            title: element.querySelector("h3").textContent.trim(),
            cover: element.querySelector("img").getAttribute("src")
        }));
    }

    async getMangaDetails(mangaId) {
        const document = await fetchHtml(mangaId);
        return new Manga({
            id: mangaId,
            title: document.querySelector(".entry-title").textContent.trim(),
            cover: document.querySelector(".poster img").getAttribute("src"),
            description: document.querySelector(".entry-content p").textContent.trim()
        });
    }

    async getChapters(mangaId) {
        const document = await fetchHtml(mangaId);
        const elements = document.querySelectorAll(".episodelist ul li a");
        return Array.from(elements).map(element => new Chapter({
            id: element.getAttribute("href"),
            title: element.textContent.trim(),
            date: new Date()
        }));
    }

    async getPages(chapterId) {
        const document = await fetchHtml(chapterId);
        const elements = document.querySelectorAll(".entry-content img");
        return Array.from(elements).map(element => new Page({
            url: element.getAttribute("src")
        }));
    }
}