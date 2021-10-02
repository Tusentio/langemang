module.exports = function (options) {
    const { supportedLanguages, languageProvider } = options;

    function resolveLocale(req) {
        if (!Array.isArray(supportedLanguages)) {
            throw new Error("Supported languages must be an array.");
        }

        if (req.cookies?.locale && supportedLanguages.includes(req.cookies.locale)) {
            return req.cookies.locale;
        } else {
            return req.acceptsLanguages(supportedLanguages) || null;
        }
    }

    return async function langemang(req, _res, next) {
        if (typeof languageProvider === "function") {
            const language = resolveLocale(req) ?? supportedLanguages[0];

            if (language != null) {
                const locale = await languageProvider(language);

                if (typeof locale === "object" && locale != null) {
                    req.locale = { ...locale, __name: language };
                }
            }
        } else {
            throw new Error("The language provider needs to be a function.");
        }

        return next();
    };
};
