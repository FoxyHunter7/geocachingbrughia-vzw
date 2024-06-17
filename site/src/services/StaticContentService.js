import config from "../data/config.json";
import fallbackLanguages from "../data/fallbackLanguages.json";
import fallbackStaticContent from "../data/fallbackStaticContent.json";
import warnings from "../data/warnings.json";
import { showConsoleDangerWarning } from "./ConsoleService";
import { LanguageProvider } from "./LanguageService";
import { ref } from "vue";

class StaticContentProvider {
    static DICTIONARY = {};
    static LANGUAGES;
    static ROUTES = {
        navHome: {
            path: "",
            aliases: []
        },
        navEvents: {
            path: "",
            aliases: []
        },
        navGeocaches: {
            path: "",
            aliases: []
        },
        navShop: {
            path: "",
            aliases: []
        }
    };
    static ERRORS = ref({
        "langFetch": "",
        "staticFetch": ""
    });
    static INIT_COMPLETE = false;

    async init() {
        await this.#fetchSupportedLanguages();
        await this.#fetchDitcionary();

        LanguageProvider.autoSetLanguage(StaticContentProvider.LANGUAGES)
        this.#setRoutes();
        
        StaticContentProvider.INIT_COMPLETE = true;
        showConsoleDangerWarning();
    }

    async #fetchSupportedLanguages() {
        try {
            const response = await fetch(`${config.apiUrl}languages`);

            if (!response.ok) {
                throw new ResponseError("Bad fetch response", response);
            }

            StaticContentProvider.LANGUAGES = await response.json();
        } catch (err) {
            console.log("ERROR While fetching languages: ", err);
            this.#setErrors(err);
            StaticContentProvider.LANGUAGES = fallbackLanguages;
        }
    }

    async #fetchDitcionary() {
        try {
            const response = await fetch(`${config.apiUrl}static`);

            if (!response.ok) {
                throw new ResponseError("Bad fetch response", response);
            }

            const unformattedDictionary = await response.json();

            unformattedDictionary.forEach(item => {
                StaticContentProvider.DICTIONARY[item.property] = {}
    
                item.contents.forEach(contents => {
                    StaticContentProvider.DICTIONARY[item.property][contents.lang_code] = contents.content;
                });
            });
        } catch (err) {
            console.log("ERROR While fetching static site content: ", err);
            this.#setErrors(err);
            StaticContentProvider.DICTIONARY = fallbackStaticContent;
        }
    }

    #setRoutes() {
        StaticContentProvider.LANGUAGES.forEach(lang => {
            if (lang.code === config.defaultLanguage) {
                StaticContentProvider.ROUTES.navHome.path = StaticContentProvider.constructRoute(lang.code, "NavHome");
                StaticContentProvider.ROUTES.navEvents.path = StaticContentProvider.constructRoute(lang.code, "NavEvents");
                StaticContentProvider.ROUTES.navGeocaches.path = StaticContentProvider.constructRoute(lang.code, "NavGeocaches");
                StaticContentProvider.ROUTES.navShop.path = StaticContentProvider.constructRoute(lang.code, "NavShop");
            } else {
                StaticContentProvider.ROUTES.navHome.aliases.push(StaticContentProvider.constructRoute(lang.code, "NavHome"));
                StaticContentProvider.ROUTES.navEvents.aliases.push(StaticContentProvider.constructRoute(lang.code, "NavEvents"));
                StaticContentProvider.ROUTES.navGeocaches.aliases.push(StaticContentProvider.constructRoute(lang.code, "NavGeocaches"));
                StaticContentProvider.ROUTES.navShop.aliases.push(StaticContentProvider.constructRoute(lang.code, "NavShop"));
            }
        });
    }

    static constructRoute(langCode, routeName) {
        return `/${langCode.toLocaleLowerCase()}/${StaticContentProvider.DICTIONARY[routeName][langCode]}`
    }

    #setErrors(err) {
        if (err.response && err.response.status) {
            switch (err.response.status) {
                case 400 || 401 || 404 || 500: StaticContentProvider.ERRORS.value.staticFetch = warnings.apiComm[LanguageProvider.CURR_LANG]; break;
                case 503: StaticContentProvider.ERRORS.value.staticFetch = warnings.apiOverloaded[LanguageProvider.CURR_LANG]; break;
            }
        }  else {
            StaticContentProvider.ERRORS.value.langFetch = warnings.apiComm[LanguageProvider.CURR_LANG];
        }
    }
}

export default StaticContentProvider;
export { StaticContentProvider };