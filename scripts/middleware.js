hexo.extend.filter.register('server_middleware', function(app) {
    const languageMap = {
        'zh': 'zh-cn',
        'zh-tw': 'zh-cn',
        'zh-hk': 'zh-cn',
        'en-us': 'en-us',
        'en': 'en-us'
    };

    app.use(function(req, res, next) {
        // 分解路径并获取第一个部分作为语言代码
        const urlParts = req.url.split('/');
        const pathLang = urlParts[1];

        // 如果路径已经是 `/en-us` 或 `/zh-cn`，不需要重定向
        if (pathLang === 'en-us' || pathLang === 'zh-cn') {
            return next();
        }

        // 如果路径开头不是有效的语言代码，或需要标准化为 `/en-us`
        const acceptLanguage = req.headers['accept-language'];
        const preferredLang = acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'en';

        // 根据映射获取目标语言，默认 `en-us`
        const targetLang = languageMap[preferredLang] || 'en-us';

        if (targetLang === 'zh-cn') {
            res.writeHead(302, { 'Location': `/zh-cn${req.url.replace(`/${pathLang}`, '')}` });
        } else {
            res.writeHead(302, { 'Location': `/en-us${req.url.replace(`/${pathLang}`, '')}` });
        }
        res.end();
    });
});
